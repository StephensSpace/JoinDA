let UserDatabaseURL = "https://joinda-1dd15-default-rtdb.europe-west1.firebasedatabase.app/User/";

window.addEventListener("load", () => {
    setTimeout(() => {
        setTimeout(() => {
            document.getElementById("logo").src = "./assets/img/logo.png";
        }, 500);
        const overlay = document.querySelector('.overlay');
        overlay.classList.add('transparent');
        setTimeout(() => {
            document.getElementById("loginContainer").classList.remove('dNone');
            document.getElementById("loginContainer").classList.add('login-container');
            document.getElementById("notAUser").classList.remove('visabilityHidden');
            document.getElementById("ppAndLnBox").classList.remove('dNone');
        }, 400);
        setTimeout(() => {
            overlay.classList.add('dNone');
        }, 2000);
    }, 3200);
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
    document.getElementById('loginContainer').classList.remove('login-container');
    document.getElementById('loginContainer').classList.add('signUpContainer');
    document.getElementById('loginContainer').innerHTML = `<div class="arrowLeft" onclick="backToLogin()">
            <img src="./assets/buttons/arrowLeft.png" id="arrowLeft">
        </div>
        <h1 id="signUpHeader">Sign up</h1>
        <div class="vector"></div>    
        <form onsubmit="SignUp(event)">
        <div class="lockWrapper">
            <input type="name" id="name" required placeholder="Name">
            <img src="./assets/icons/person.svg" alt="" class="person">
        </div>
        <div class="dNone" id="msgBox2">This Name is allready in Use</div>
        <div class="lockWrapper">
            <input type="email" id="email" required placeholder="Email">
            <img src="./assets/icons/mail.svg" alt="" class="mailSignUp">
        </div>
        <div class="lockWrapper">
            <input type="password" id="password" required placeholder="Password">
            <img src="./assets/icons/lock.svg" alt="" class="lockSignUp">
        </div>
        <div class="lockWrapper">
            <input type="password" id="pwCheck" required placeholder="Confirm Password">
            <img src="./assets/icons/lock.svg" alt="" class="lockSignUp2">
        </div>
        <div class="privacyCheckbox">
            <input type="checkbox" class="customCheckbox" required onchange="toggleSubmitButton(this)">
            <span id="iAccept">I accept the
                <a href="privacy_policy.html">Privacy policy</a>
            </span>
        </div>
        <button type="submit" id="submitButton" class="buttonLogIn" disabled>
            <span class="btnTextLogin">
                Sign Up
            </span>
        </button>
    </form>`
}