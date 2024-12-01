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

async function guestLogin() {
    
    try {
        const User = await fetch(UserDatabaseURL + 'Guest.json')
        const GuestUser = await User.json();
        sessionStorage.setItem("User", GuestUser.name); 
    } catch (error) {
        console.error("Fehler beim Gastlogin:", error);
    }
    window.location.href = "welcome.html";
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
        sessionStorage.setItem("User", fittingUser.name);
        window.location.href = "welcome.html";
    }
    else {
        document.getElementById('msgBox').classList.remove('dNone');
        document.getElementById('msgBox').classList.add('dBlock');
    }
}

function loadRegister() {
    document.getElementById('loginContainer').classList.remove('login-container');
    document.getElementById('loginContainer').classList.add('signUpContainer');
    document.getElementById('loginContainer').innerHTML = signUpForm()
}