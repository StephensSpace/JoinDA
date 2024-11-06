// Animation und Einblenden des Login-Formulars nach 5 Sekunden Wartezeit + 1 Sekunde Animation
window.addEventListener("load", () => {
  setTimeout(() => {
    // Login-Container und "Not a User" einblenden
    document.getElementById("loginContainer").style.display = "block";
    document.getElementById("notAUser").style.display = "block";
  }, 6000); // 5 Sekunden Wartezeit + 1 Sekunde für die Animation
});

// Funktion für den Gast-Login
function guestLogin() {
  window.location.href = "summary.html";
}
