import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

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
const db = getFirestore(app);

window.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("submit-l");

  loginBtn.addEventListener("click", async function (event) {
    event.preventDefault();

    const email = document.getElementById("email-l").value.trim();
    const password = document.getElementById("password-l").value;

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userEmail = userCredential.user.email;

      // Function to check if email exists in a collection
      const checkRole = async (collectionName) => {
        const q = query(collection(db, collectionName), where("email", "==", userEmail));
        const snapshot = await getDocs(q);
        return !snapshot.empty;
      };

      if (await checkRole("Admins")) {
        localStorage.setItem("userEmail", userEmail);
        window.location.href = "admin/dashboard.html";
      } else if (await checkRole("Patients")) {
        localStorage.setItem("userEmail", userEmail);
        window.location.href = "patient/dashboard.html";
      } else if (await checkRole("Specialists")) {
        localStorage.setItem("userEmail", userEmail);
        window.location.href = "specialist/dashboard.html";
      } else {
        alert("No role found for this account.");
      }

    } catch (error) {
      alert(error.message);
    }
  });
});
