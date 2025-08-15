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

    const formOpenBtn = document.querySelector("#form-open");
    const formContainer = document.querySelector(".form_container");
    const formCloseBtn = document.querySelector(".form_close");
    const signupBtn = document.querySelector("#signup");
    const loginBtn = document.querySelector("#login");
    const pwShowHide = document.querySelectorAll(".pw_hide");

    if (formContainer) {
        formContainer.classList.remove("show");

        formOpenBtn?.addEventListener("click", (e) => {
            e.preventDefault();
            formContainer.classList.add("show");
        });

        formCloseBtn?.addEventListener("click", (e) => {
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

        signupBtn?.addEventListener("click", (e) => {
            e.preventDefault();
            formContainer.classList.add("active");
        });

        loginBtn?.addEventListener("click", (e) => {
            e.preventDefault();
            formContainer.classList.remove("active");
        });

        const startNowBtn = document.querySelector(".order-now");

        startNowBtn?.addEventListener("click", (e) => {
            e.preventDefault();
            formContainer.classList.add("show");
            formContainer.classList.remove("active"); 
        });
    }
});
