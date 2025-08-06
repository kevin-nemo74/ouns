import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  getDoc,
  doc,
  addDoc,
  deleteDoc,
  query,
  where
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBdHXiTUEsC0Ix-vMpicUIRwZsPL_xUPHc",
  authDomain: "teste-de97a.firebaseapp.com",
  projectId: "teste-de97a",
  storageBucket: "teste-de97a.appspot.com",
  messagingSenderId: "238622857832",
  appId: "1:238622857832:web:34485f56458abdfa5139dd"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// تحميل المقالات في articles.html
async function loadArticles() {
  const container = document.getElementById("articles-container");
  if (!container) return;

  const articlesWrapper = document.createElement("div");
  articlesWrapper.className = "p-articles-section";
  container.appendChild(articlesWrapper);

  const auth = getAuth();
  auth.onAuthStateChanged(async (user) => {
    if (!user) return;

    const q = query(collection(db, "Articles"), where("email", "==", user.email));
    const querySnapshot = await getDocs(q);

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
        window.location.href = "article-d.html";
      });
      articlesWrapper.appendChild(card);
    });
  });
}

// تحميل تفاصيل المقال في article-d.html
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
    contentEl.innerText = data.content;
  } else {
    titleEl.innerText = "المقال غير موجود.";
  }
}

// حذف المقال في article-d.html
function setupDeleteButton() {
  const deleteBtn = document.getElementById("delete-article-btn");
  if (deleteBtn) {
    deleteBtn.addEventListener("click", async () => {
      const articleId = localStorage.getItem("articleId");
      if (!articleId) {
        alert("لا يوجد مقال لتقوم بحذفه.");
        return;
      }

      if (confirm("هل أنت متأكد أنك تريد حذف هذا المقال؟")) {
        await deleteDoc(doc(db, "Articles", articleId));
        alert("تم حذف المقال.");
        window.location.href = "articles.html";
      }
    });
  }
}

// فتح وإغلاق نافذة إضافة المقال
function setupModalHandlers() {
  const openBtn = document.getElementById("add-article-btn");
  const closeBtn = document.getElementById("close-modal-btn");

  if (openBtn) {
    openBtn.addEventListener("click", () => {
      document.getElementById("add-modal").classList.remove("hidden");
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      document.getElementById("add-modal").classList.add("hidden");
    });
  }
}

// زر إضافة مقال
function setupAddArticle() {
  const submitBtn = document.getElementById("submit-article-btn");
  if (!submitBtn) return;

  submitBtn.addEventListener("click", async () => {
    const title = document.getElementById("article-title-input").value.trim();
    const content = document.getElementById("article-content-input").value.trim();

    const auth = getAuth();
    const user = auth.currentUser;
    if (!user || !title || !content) {
      alert("يرجى ملء جميع الحقول");
      return;
    }

    // جلب اسم وجنس المختص عبر الإيميل
    const specialistsRef = collection(db, "Specialists");
    const q = query(specialistsRef, where("email", "==", user.email));
    const querySnapshot = await getDocs(q);

    let authorName = "غير معروف";
    let gender = "غير محدد";

    querySnapshot.forEach((docSnap) => {
      const specialistData = docSnap.data();
      authorName = specialistData.name || "غير معروف";
      gender = specialistData.gender || "غير محدد";
    });

    // إضافة المقالة
    await addDoc(collection(db, "Articles"), {
      title,
      content,
      author: authorName,
      gender: gender,
      email: user.email,
      createdAt: new Date()
    });

    alert("تمت إضافة المقال بنجاح");
    document.getElementById("add-modal").classList.add("hidden");
    location.reload();
  });
}

// تحديد الصفحة وتشغيل المهام
if (window.location.pathname.includes("articles.html")) {
  loadArticles();
  setupModalHandlers();
  setupAddArticle();
} else if (window.location.pathname.includes("article-d.html")) {
  loadArticleDetails();
  setupDeleteButton();
}
