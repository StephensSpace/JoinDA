let name = ''
function SignUp() {
    //document.getElementById('wrongPwText').innerHTML = ''
    let name = document.getElementById('name').value
    let email = document.getElementById('email').value
    let password = document.getElementById('password').value
    let passwordCheck = document.getElementById('pwCheck').value
    const userRef = firebase.database().ref('User/' + name);
    password == passwordCheck ? setUserToFirebase(userRef, name, email, password) : wrongPwCheck()
}

async function checkNewUserAvailable(name, email, password) {
    try {
        
        const snapshot = await userRef.get();
        snapshot.exists ? userInUse() : setUserToFirebase(userRef, name, email, password);
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
        //document.getElementById('msgBox').innerHTML = 'User successfully registered!';
    } catch (error) {
        console.error("Error saving user to Firebase:", error);
        //document.getElementById('msgBox').innerHTML = 'Error saving user. Please try again.';
    }
}