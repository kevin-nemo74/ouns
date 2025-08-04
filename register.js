import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

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
const db = getFirestore(app); // ✅ Firestore


const joinForm = document.getElementById("joinForm");

joinForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const fullName = document.getElementById("fullName").value;
  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;
  const specialty = document.getElementById("specialty").value;
  const experience = document.getElementById("experience").value;
  const password = document.getElementById("password").value;
  const cvLink = document.getElementById("cvLink").value;
  const message = document.getElementById("message").value;
  const gender = document.getElementById("gender").value;
  const price = document.getElementById("price").value;


  try {
    await addDoc(collection(db, "PendingSpecialists"), {
      fullName,
      price,
      email,
      phone,
      specialty,
      experience,
      password,
      cvLink,
      message,
      gender,
    });

    alert("تم إرسال طلبك بنجاح. سيتم مراجعته من طرف الإدارة.");
    joinForm.reset();
  } catch (error) {
    console.error("خطأ أثناء الإرسال:", error);
    alert("حدث خطأ، حاول مرة أخرى.");
  }
});

window.addEventListener("DOMContentLoaded", () => {
  const submitBtn = document.getElementById("submit-r");

  submitBtn.addEventListener("click", async function (event) {
    event.preventDefault();

    const name = document.getElementById("name-r").value.trim();
    const email = document.getElementById("email-r").value.trim();
    const password = document.getElementById("psw-r").value;
    const confirmPassword = document.getElementById("psw2-r").value;

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (!name) {
      alert("Please enter your full name");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save to Firestore under 'Patients' with the UID as doc ID
      await setDoc(doc(db, "Patients", user.uid), {
        name: name,
        email: email,
        password: password // ⚠️ Not recommended to store plain passwords in real apps
      });

      alert("Account created and saved successfully");
      window.location.href = "patient/dashboard.html";
      // location.href = "patient/dashboard.html"; // optional redirect
    } catch (error) {
      alert(error.message);
    }
  });
});



