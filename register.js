// register.js
document.getElementById("registerForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const userData = {
    forename: forename.value,
    surname: surname.value,
    username: username.value
  };

  // Save user profile only
  sessionStorage.setItem("plasmaUserProfile", JSON.stringify(userData));

  // Move to wallet page
  window.location.href = "dashboard.html";
});
