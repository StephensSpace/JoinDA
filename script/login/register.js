function SignUp(event) {
    document.getElementById('msgBox2').classList.add('visabilityHidden');
    event.preventDefault();
    let name = document.getElementById('name').value
    let email = document.getElementById('email').value
    let password = document.getElementById('password').value
    let passwordCheck = document.getElementById('pwCheck').value
    const userRef = firebase.database().ref('User/' + name);
    password == passwordCheck ? checkNewUserAvailable(userRef, name, email, password) : wrongPwCheck()
}

async function checkNewUserAvailable(userRef, name, email, password) {
    try {
        const snapshot = await fetch(UserDatabaseURL + '.json')
        const data = await snapshot.json();
        const user = Object.values(data).find(user => user.name === name);
        user ? userInUse() : setUserToFirebase(userRef, name, email, password);
    } catch (error) {
        console.error("Fehler beim Speichern in Firebase:", error);
    }
}

function wrongPwCheck() {
    document.getElementById('msgBox2').classList.remove("visabilityHidden");
    document.getElementById('msgBox2').innerHTML = 'Password does not Match';
    document.getElementById('submitButton').disabled = true;
    document.getElementById('pwCheck').value = '';
}

async function setUserToFirebase(userRef, name, email, password) {
    try {
        await userRef.set({
            name: name,
            email: email,
            password: password
        });
        clearInput()
        slideIn()
    } catch (error) {
        document.getElementById('msgBox2').classList.remove("visabilityHidden");
        document.getElementById('msgBox2').innerHTML = 'Username not available';
    }
}

function clearInput() {
    document.getElementById('name').value = ''
    document.getElementById('email').value = ''
    document.getElementById('password').value = ''
    document.getElementById('pwCheck').value = ''
}

function slideIn() {
    const signedUpElement = document.getElementById("signedUp");
    signedUpElement.classList.add("slide-in");
    setTimeout(() => slideOut(signedUpElement), 4000);
}

function slideOut(signedUpElement) {
    signedUpElement.classList.remove("slide-in");
    signedUpElement.classList.add("slide-out");
    setTimeout(() => {
        signedUpElement.classList.remove("slide-out");
    }, 4000);
}

function userInUse() {
    document.getElementById('msgBox2').classList.remove("visabilityHidden");
    document.getElementById('msgBox2').innerHTML = 'Username not available';
}

function toggleSubmitButton() {
    const submitButton = document.getElementById('submitButton');
    submitButton.disabled = !(document.getElementById('checkBox').checked &&
        document.getElementById('name').value &&
        document.getElementById('email').value &&
        document.getElementById('password').value &&
        document.getElementById('pwCheck').value);
}

function backToLogin() {
    document.getElementById('loginContainer').classList.add('login-container');
    document.getElementById('loginContainer').classList.remove('signUpContainer');
    document.getElementById('loginContainer').innerHTML = loginForm()
}