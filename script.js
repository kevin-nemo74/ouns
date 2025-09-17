import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

const firebaseConfig = {
  // بيانات مشروعك من Firebase
};

import { getApps, initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const db = getFirestore(app);

const buttons = document.querySelectorAll(".card-button-t");
const popup = document.getElementById("popup-overlay");
const popupList = document.getElementById("popup-tests-list");
const closeBtn = document.getElementById("close-popup");

const domainTitles = [
  "اختبارات أسرية",
  "اختبارات زواجية",
  "اختبارات نفسية",
  "اختبارات تربوية"
];

buttons.forEach((btn, index) => {
  btn.addEventListener("click", async () => {
    const domain = domainTitles[index];
    const q = query(collection(db, "tests"), where("domaine", "==", domain));
    const snapshot = await getDocs(q);

    popupList.innerHTML = "";
    if (snapshot.empty) {
      popupList.innerHTML = "<p>لا توجد اختبارات حالياً في هذا القسم.</p>";
    } else {
      snapshot.forEach(doc => {
        const data = doc.data();
        popupList.innerHTML += `
          <div class="test-item">
            <h4>${data.name}</h4>
            <p>${data.desc}</p>
            <button>ابدأ الاختبار</button>
          </div>
        `;
      });
    }

    popup.style.display = "flex";
  });
});

closeBtn.addEventListener("click", () => {
  popup.style.display = "none";
});
