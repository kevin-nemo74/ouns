import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  getDoc,
  doc
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";


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
  const articlesView = document.getElementById("articles-view");
  const categoryTilesContainer = document.querySelector(".category-tiles-container");

  if (!container || !articlesView || !categoryTilesContainer) return;

  const querySnapshot = await getDocs(collection(db, "Articles"));
  let articlesData = [];
  querySnapshot.forEach((docSnap) => {
    articlesData.push({ id: docSnap.id, ...docSnap.data() });
  });

  // إضافة event listeners للفئات
  const categoryTiles = document.querySelectorAll(".category-tile");
  categoryTiles.forEach(tile => {
    tile.addEventListener("click", () => {
      const category = tile.getAttribute("data-category");
      showArticlesForCategory(category, articlesData);
    });
  });

  // إضافة event listener للعودة للفئات
  const backButton = document.getElementById("back-to-categories");
  if (backButton) {
    backButton.addEventListener("click", () => {
      showCategoryTiles();
    });
  }
}

function showArticlesForCategory(category, articlesData) {
  const categoryTilesContainer = document.querySelector(".category-tiles-container");
  const articlesView = document.getElementById("articles-view");
  const currentCategoryTitle = document.getElementById("current-category-title");
  const articlesList = document.getElementById("articles-list");

  // إخفاء فئات المقالات وإظهار المقالات
  categoryTilesContainer.style.display = "none";
  articlesView.style.display = "block";

  // تحديث عنوان الفئة الحالية
  currentCategoryTitle.textContent = `مقالات ${category}`;

  // تصفية المقالات حسب الفئة
  const filteredArticles = articlesData.filter(article => article.category === category);

  // عرض المقالات
  articlesList.innerHTML = "";

  if (filteredArticles.length === 0) {
    articlesList.innerHTML = `
      <div class="no-articles">
        <p>لا توجد مقالات في هذه الفئة حالياً</p>
      </div>
    `;
    return;
  }

  filteredArticles.forEach(article => {
    const card = document.createElement("div");
    card.className = "card-t";
    card.innerHTML = `
      <div class="card-header-t">
        <h2 class="card-title-t">${article.title}</h2>
      </div>
      <p class="card-desc-t">${article.content.slice(0, 100)}...</p>
      <button class="card-button-t">اقرأ المزيد</button>
    `;

    card.addEventListener("click", () => {
      localStorage.setItem("articleId", article.id);
      window.location.href = "article-d.html";
    });

    articlesList.appendChild(card);
  });
}

function showCategoryTiles() {
  const categoryTilesContainer = document.querySelector(".category-tiles-container");
  const articlesView = document.getElementById("articles-view");

  // إظهار فئات المقالات وإخفاء المقالات
  categoryTilesContainer.style.display = "block";
  articlesView.style.display = "none";
}


// ===== تحميل التفاصيل في article-d.html =====
async function loadArticleDetails() {
  const titleEl = document.getElementById("article-title");
  const contentEl = document.getElementById("article-content");
  const authorEl = document.getElementById("article-author");

  if (!titleEl || !contentEl) return;

  const articleId = localStorage.getItem("articleId");
  if (!articleId) {
    titleEl.innerText = "لا يوجد مقال محدد.";
    return;
  }

  const articleRef = doc(db, "Articles", articleId);
  const docSnap = await getDoc(articleRef);

  if (!docSnap.exists()) {
    titleEl.innerText = "المقال غير موجود.";
    return;
  }

  const data = docSnap.data();
  titleEl.innerText = data.title;

  if (authorEl) {
    let prefix = "المستشار النفسي";
    if (data.gender === "امرأة") prefix = "المستشارة النفسية";
    authorEl.innerText = `✍️ ${prefix} : ${data.author || "غير معروف"}`;
  }

  contentEl.innerText = data.content;
}


// تحديد الصفحة الحالية وتشغيل الدالة المناسبة
if (window.location.pathname.includes("article-d.html")) {
  loadArticleDetails();
} else if (window.location.pathname.includes("articles.html")) {
  loadArticles();
}
