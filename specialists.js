import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  addDoc
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBdHXiTUEsC0Ix-vMpicUIRwZsPL_xUPHc",
  authDomain: "teste-de97a.firebaseapp.com",
  projectId: "teste-de97a",
  storageBucket: "teste-de97a.appspot.com",
  messagingSenderId: "238622857832",
  appId: "1:238622857832:web:34485f56458abdfa5139dd"
};

// Init Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// عناصر الفلترة
const specialtySelect = document.getElementById("filter-specialty");
const genderSelect = document.getElementById("filter-gender");

specialtySelect.addEventListener("change", applyFilters);
genderSelect.addEventListener("change", applyFilters);

function applyFilters() {
  const specialty = specialtySelect.value;
  const gender = genderSelect.value;
  loadSpecialists(specialty, gender);
}

// تحميل المختصين
async function loadSpecialists(specialtyFilter = "all", genderFilter = "all") {
  const container = document.querySelector(".card-container");
  container.innerHTML = "";

  try {
    const specialistsRef = collection(db, "Specialists");

    let constraints = [];
    if (specialtyFilter !== "all") {
      constraints.push(where("specialiste", "==", specialtyFilter));
    }
    if (genderFilter !== "all") {
      constraints.push(where("gender", "==", genderFilter));
    }

    const q = constraints.length ? query(specialistsRef, ...constraints) : specialistsRef;
    const snapshot = await getDocs(q);

    snapshot.forEach(doc => {
      const data = doc.data();

      const card = document.createElement("div");
      card.className = "card-p-s";
      card.innerHTML = `
        <img src="../images/psy11.png" alt="صورة">
        <h3>${data.name}</h3>
        <p>${data.specialiste}</p>
        <div class="price">${data.price} دج</div>
        <button class="book-btn" data-email="${data.email}">احجز معه</button>
        <button class="view-btn">عرض الملف</button>
      `;
      container.appendChild(card);
    });

  } catch (error) {
    console.error("Error loading specialists:", error);
  }
}

// التعامل مع النوافذ
let currentSpecialistEmail = null;

document.addEventListener("DOMContentLoaded", () => {
  loadSpecialists();

  document.addEventListener("click", function (e) {
    if (e.target.classList.contains("book-btn")) {
      currentSpecialistEmail = e.target.dataset.email;
      document.getElementById("booking-popup").classList.remove("hidden");
    }
  });

  // إغلاق النافذة
  document.getElementById("close-popup").addEventListener("click", () => {
    document.getElementById("booking-popup").classList.add("hidden");
  });

document.getElementById("confirm-booking").addEventListener("click", async () => {
  const date = document.getElementById("booking-date").value;
  const time = document.getElementById("booking-time").value;

  if (!date || !time || !currentSpecialistEmail) {
    alert("يرجى اختيار التاريخ والوقت.");
    return;
  }

  const user = auth.currentUser;
  if (!user) {
    alert("يجب تسجيل الدخول أولاً.");
    return;
  }

  try {
    // جلب اسم العميل
    const clientSnap = await getDocs(query(collection(db, "Patients"), where("email", "==", user.email)));
    const clientName = clientSnap.empty ? "غير معروف" : clientSnap.docs[0].data().name;

    // جلب اسم المختص
    const specSnap = await getDocs(query(collection(db, "Specialists"), where("email", "==", currentSpecialistEmail)));
    const specialistName = specSnap.empty ? "غير معروف" : specSnap.docs[0].data().name;

    // إنشاء الموعد
    await addDoc(collection(db, "Appointments"), {
      client: user.email,
      clientName: clientName,
      specialist: currentSpecialistEmail,
      specialistName: specialistName,
      date: date,
      time: time,
      status: "معلقة"
    });

    alert(`تم حجز موعدك يوم ${date} على الساعة ${time}`);
    document.getElementById("booking-popup").classList.add("hidden");

  } catch (error) {
    console.error("Error booking appointment:", error);
    alert("حدث خطأ أثناء الحجز. حاول مرة أخرى.");
  }
});

});
