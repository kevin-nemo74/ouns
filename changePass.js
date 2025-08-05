  import {
    getAuth,
    reauthenticateWithCredential,
    EmailAuthProvider,
    updatePassword,
    onAuthStateChanged
  } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";

  const firebaseConfig = {
    apiKey: "AIzaSyBdHXiTUEsC0Ix-vMpicUIRwZsPL_xUPHc",
    authDomain: "teste-de97a.firebaseapp.com",
    projectId: "teste-de97a",
    storageBucket: "teste-de97a.firebasestorage.app",
    messagingSenderId: "238622857832",
    appId: "1:238622857832:web:34485f56458abdfa5139dd"
  };

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);

  const form = document.querySelector(".password-form");

  onAuthStateChanged(auth, (user) => {
    if (!user) {
      alert("يجب تسجيل الدخول لتغيير كلمة المرور.");
      window.location.href = "../index.html";
      return;
    }

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const oldPassword = document.getElementById("old-password").value;
      const newPassword = document.getElementById("new-password").value;

      const credential = EmailAuthProvider.credential(user.email, oldPassword);

      try {
        // إعادة التحقق من هوية المستخدم
        await reauthenticateWithCredential(user, credential);

        // تحديث كلمة المرور
        await updatePassword(user, newPassword);
        alert("✅ تم تغيير كلمة المرور بنجاح!");
        form.reset();
      } catch (error) {
        console.error(error);
if (error.code === "auth/invalid-credential" || error.code === "auth/wrong-password") {
          alert("❌ كلمة المرور القديمة غير صحيحة.");
        } else if (error.code === "auth/weak-password") {
          alert("❌ كلمة المرور الجديدة ضعيفة. يجب أن تكون 6 أحرف على الأقل.");
        } else {
          alert("حدث خطأ أثناء تغيير كلمة المرور.");
        }
      }
    });
  });
