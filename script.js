document.addEventListener('DOMContentLoaded', function () {

    const navLinks = document.querySelectorAll(".nav-menu .nav-link");
    const menuOpenButton = document.querySelector("#menu-open-button");
    const menuCloseButton = document.querySelector("#menu-close-button");

    menuOpenButton.addEventListener("click", () => {
        document.body.classList.toggle("show-mobile-menu");
    });

    menuCloseButton.addEventListener("click", () => menuOpenButton.click());
    navLinks.forEach(link => {
        link.addEventListener("click", () => menuOpenButton.click());
    });


    const swiper = new Swiper('.slider-wrapper', {
        loop: true,
        grabCursor: true,
        spaceBetween: 25,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
            dynamicBullets: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        breakpoints: {
            0: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
        }
    });


    const formOpenBtn = document.querySelector("#form-open");
    const formContainer = document.querySelector(".form_container");
    const formCloseBtn = document.querySelector(".form_close");
    const signupBtn = document.querySelector("#signup");
    const loginBtn = document.querySelector("#login");
    const pwShowHide = document.querySelectorAll(".pw_hide");

    formContainer.classList.remove("show");

    formOpenBtn.addEventListener("click", (e) => {
        e.preventDefault();
        formContainer.classList.add("show");
    });

    formCloseBtn.addEventListener("click", (e) => {
        e.preventDefault();
        formContainer.classList.remove("show");
    });

    pwShowHide.forEach(icon => {
        icon.addEventListener("click", () => {
            let getPwInput = icon.parentElement.querySelector("input");
            if (getPwInput.type === "password") {
                getPwInput.type = "text";
                icon.classList.replace("uil-eye-slash", "uil-eye");
            } else {
                getPwInput.type = "password";
                icon.classList.replace("uil-eye", "uil-eye-slash");
            }
        });
    });

    signupBtn.addEventListener("click", (e) => {
        e.preventDefault();
        formContainer.classList.add("active");
    });

    loginBtn.addEventListener("click", (e) => {
        e.preventDefault();
        formContainer.classList.remove("active");
    });

    const startNowBtn = document.querySelector(".order-now");

    startNowBtn.addEventListener("click", (e) => {
        e.preventDefault();
        formContainer.classList.add("show");
        formContainer.classList.remove("active"); 
    });
});


const swiper = new Swiper('.slide-content-u', {

  slidesPerView: 3,
  spaceBetween: 25,
  loop: true,

  centerSlide: 'true',
  fade: 'true',
  grabCursor: true,
  // If we need pagination
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
    dynamicBullets: true,
  },

  // Navigation arrows
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },

  breakpoints: {
    0: {
      slidesPerView: 1,
    },
    520: {
      slidesPerView: 2,
    },
    950: {
      slidesPerView: 3,
    },
  },
});


/* Tests Patient */
 import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
  import {
    getFirestore, collection, query, where, getDocs
  } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

  const firebaseConfig = {
    // بيانات مشروعك من Firebase
  };

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  const buttons = document.querySelectorAll(".card-button-t");
  const popup = document.getElementById("popup-overlay");
  const popupList = document.getElementById("popup-tests-list");
  const closeBtn = document.getElementById("close-popup");

  const domainTitles = [
    "اختبارات اسرية",
    "اختبارات تربوية",
    "اختبارات نفسية",
    "اختبارات شخصية"
  ];

  buttons.forEach((btn, index) => {
    btn.addEventListener("click", async () => {
      const domain = domainTitles[index];
      const q = query(collection(db, "tests"), where("domaine", "==", domain));
      const snapshot = await getDocs(q);

      popupList.innerHTML = ""; // تنظيف القائمة القديمة
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