function SignUp(event) {
    //document.getElementById('msgBox').innerHTML = ''
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
        const snapshot = await fetch(UserDatabaseURL +'.json')
        const data = await snapshot.json();
        const user = Object.values(data).find(user => user.name === name);
        user ? userInUse():setUserToFirebase(userRef, name, email, password);
    } catch (error) {
        console.error("Fehler beim Speichern in Firebase:", error);
    }
}

function wrongPwCheck() {
    //document.getElementById('msgBox').innerHTML = 'Your Password does not Match';
    document.getElementById('password').value = '';
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
        //document.getElementById('msgBox').innerHTML = 'User successfully registered!';
    } catch (error) {
        console.error("Error saving user to Firebase:", error);
        //document.getElementById('msgBox').innerHTML = 'Error saving user. Please try again.';
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
}

function userInUse() {
    console.log('Benutzer besteht bereits')
}