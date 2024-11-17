let UserDatabaseURL = "https://joinda-1dd15-default-rtdb.europe-west1.firebasedatabase.app/User/";

// Animation und Einblenden des Login-Formulars nach 5 Sekunden Wartezeit + 1 Sekunde Animation
window.addEventListener("load", () => {
    setTimeout(() => {
        // Login-Container und "Not a User" einblenden
        document.getElementById("loginContainer").classList.add('loginContainerFlex');
        document.getElementById("notAUser").style.display = "block";
    }, 4000); // 5 Sekunden Wartezeit + 1 Sekunde für die Animation
});

// Funktion für den Gast-Login
function guestLogin() {
    window.location.href = "summary.html";
}

async function login() {
    document.getElementById('msgBox').classList.add('dNone');
    document.getElementById('msgBox').classList.remove('dBlock');
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
    let fittingUser = Object.values(data).find(user => user.email == mail.value && user.password == password.value)
    if (fittingUser) {
        window.location.href = "summary.html";
    }
    else {
        document.getElementById('msgBox').classList.remove('dNone');
        document.getElementById('msgBox').classList.add('dBlock');
    }
}

function loadRegister() {
    document.getElementById('loginContainer').innerHTML = `<div class="SignUpHead">
            <img src="./assets/buttons/arrowLeft.png" id="arrowLeft" onclick="backToLogin()">
            <h1 id="signUpHeader">SIGN UP</h1>
        </div>
        <form onsubmit="SignUp(event)">
        <input type="name" id="name" required placeholder="Name">
        <div class="dNone" id="msgBox2">This Name is allready in Use</div>
        <input type="email" id="email" required placeholder="Email">
        <input type="password" id="password" required placeholder="Password">
        <input type="password" id="pwCheck" required placeholder="Confirm Password">
        <button type="submit">Sign Up</button>
    </form>`
}