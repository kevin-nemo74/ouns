// js/authCheck.js

export function protectPage(requiredRole) {
  const role = localStorage.getItem("role");
  const userEmail = localStorage.getItem("userEmail");

  if (!role || !userEmail) {
    window.location.href = "../index.html";
    return;
  }

  if (role !== requiredRole) {
    window.location.href = "../index.html";
  }
}
