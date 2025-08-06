import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBdHXiTUEsC0Ix-vMpicUIRwZsPL_xUPHc",
  authDomain: "teste-de97a.firebaseapp.com",
  projectId: "teste-de97a",
  storageBucket: "teste-de97a.firebasestorage.app",
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
<<<<<<< HEAD
        <img src="${data.image}" alt="صورة">
        <h3>${data.name}</h3>
        <p>${data.specialiste}</p>
        <div class="stars doctor-rating" data-rating="${data.rating}"></div>
=======
        <img src="../images/psy11.png" alt="صورة">
        <h3>${data.name}</h3>
        <p>${data.specialiste}</p>
        <div class="price">${data.price} دج</div>
>>>>>>> origin/up
      `;
      container.appendChild(card);
    });

<<<<<<< HEAD
    // تفعيل النجوم بعد إدخال البطاقات
    $(".doctor-rating").rateYo({
      starWidth: "20px",
      ratedFill: "#FFD700",
      normalFill: "#CCCCCC",
      readOnly: true,
      rtl: true,
      numStars: 5,
      precision: 1
    });
=======
>>>>>>> origin/up

  } catch (error) {
    console.error("Error loading specialists:", error);
  }
}

// تحميل أولي عند فتح الصفحة
document.addEventListener("DOMContentLoaded", () => loadSpecialists());
