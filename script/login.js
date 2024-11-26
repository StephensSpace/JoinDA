let UserDatabaseURL = "https://joinda-1dd15-default-rtdb.europe-west1.firebasedatabase.app/User/";

window.addEventListener("load", () => {
    setTimeout(() => {
        document.getElementById("loginContainer").classList.remove('dNone');
        document.getElementById("loginContainer").classList.add('login-container');
        document.getElementById("notAUser").classList.remove('dNone');
        document.getElementById("notAUser").classList.add('not-a-user');
        document.getElementById("ppAndLnBox").classList.remove('dNone');
    }, 4000); 
});

async function guestLogin() {
    
    try {
        const User = await fetch(UserDatabaseURL + 'Guest.json')
        const GuestUser = await User.json();
        sessionStorage.setItem("User", GuestUser.name); 
    } catch (error) {
        console.error("Fehler beim Gastlogin:", error);
    }
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
    let fittingUser = Object.values(data).find(user => user.email == mail.value && user.password == password.value);
    console.log(fittingUser);
    if (fittingUser) {
        sessionStorage.setItem("User", fittingUser.name);
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
    document.getElementById('loginContainer').innerHTML = signUpForm();
}