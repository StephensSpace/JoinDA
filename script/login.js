let UserDatabaseURL = "https://joinda-1dd15-default-rtdb.europe-west1.firebasedatabase.app/User/";

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

async function login() {
    let mail = document.getElementById('email')
    let password = document.getElementById('password')

    try {
        const Users = await fetch(UserDatabaseURL + '.json')
        const data = await Users.json();
        checkPw(mail, password, data)
    } catch (error) {
        console.error("Fehler beim Speichern in Firebase:", error);
    }
}

function checkPw(mail, password, data) {
    console.log(data);
    let fittingUser = Object.values(data).find(user => user.email == mail.value && user.password == password.value)
    if (fittingUser) {
        window.location.href = "summary.html";
    }
    else {
        alert("Login failed: User not found or incorrect password.");
    }
}

function loadRegister() {
    document.getElementById('loginContainer').innerHTML = `<div class="SignUpHead">
            <img src="./assets/buttons/arrowLeft.png" id="arrowLeft">
            <h1 id="signUpHeader">SIGN UP</h1>
        </div>
        <form onsubmit="SignUp(event)">
        <input type="name" id="name" required placeholder="Name">
        <input type="email" id="email" required placeholder="Email">
        <input type="password" id="password" required placeholder="Password">
        <input type="password" id="pwCheck" required placeholder="Confirm Password">
        <button type="submit">Sign Up</button>
    </form>`
}