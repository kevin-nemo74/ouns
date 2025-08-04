import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  getDoc,
  doc,
  deleteDoc
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

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ===== تحميل المقالات في article.html =====
async function loadArticles() {
  const container = document.getElementById("articles-container");
  if (!container) return;

  const articlesWrapper = document.createElement("div");
  articlesWrapper.className = "p-articles-section";
  container.appendChild(articlesWrapper);

  const querySnapshot = await getDocs(collection(db, "Articles"));
  querySnapshot.forEach((docSnap) => {
    const data = docSnap.data();
    const card = document.createElement("div");
    card.className = "card-t";
    card.innerHTML = `
      <div class="card-header-t">
        <h2 class="card-title-t">${data.title}</h2>
      </div>
      <p class="card-desc-t">${data.content.slice(0, 100)}...</p>
      <button class="card-button-t">اقرأ المزيد</button>
    `;
    card.addEventListener("click", () => {
      localStorage.setItem("articleId", docSnap.id);
      window.location.href = "articles-d-admin.html";
    });
    articlesWrapper.appendChild(card);
  });
}

// ===== تحميل التفاصيل في article-d.html =====
async function loadArticleDetails() {
  const titleEl = document.getElementById("article-title");
  const contentEl = document.getElementById("article-content");

  if (!titleEl || !contentEl) return;

  const articleId = localStorage.getItem("articleId");
  if (!articleId) {
    titleEl.innerText = "لا يوجد مقال محدد.";
    return;
  }

  const articleRef = doc(db, "Articles", articleId);
  const docSnap = await getDoc(articleRef);

  if (docSnap.exists()) {
    const data = docSnap.data();
    titleEl.innerText = data.title;
    const authorEl = document.getElementById("article-author");
if (authorEl) authorEl.innerText = `✍️ ${data.author || "غير معروف"}`;
    contentEl.innerText = data.content;

    // زر الحذف يظهر فقط إذا كان موجودًا في الصفحة (أي صفحة admin)
    const deleteBtn = document.getElementById("delete-article-btn");
    if (deleteBtn) {
      deleteBtn.style.display = "inline";
      deleteBtn.onclick = async () => {
        const confirmDelete = confirm("هل أنت متأكد أنك تريد حذف هذا المقال؟");
        if (confirmDelete) {
          await deleteDoc(articleRef);
          alert("تم حذف المقال.");
          window.location.href = "articles.html";
        }
      };
    }

  } else {
    titleEl.innerText = "المقال غير موجود.";
  }
}

// تحديد الصفحة الحالية وتشغيل الدالة المناسبة
if (window.location.pathname.includes("articles-d-admin.html")) {
  loadArticleDetails();
} else if (window.location.pathname.includes("articles.html")) {
  loadArticles();
}


