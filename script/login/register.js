/**
 * 
 * @param {SubmitEvent} event triggert das Submit event auf dem Formular
 * Zunächst wird die eventuel eingeblendete msgBox2 versteckt, das Bubbling nach innen wird verhindert.
 * Jetzt werden die Werte der Eingabefelder in Variabeln gebunden. In der const userRef wird auf einen 
 * Pfad in der firebase Datenbank verwiesen der dem namen des Users aus der Variable name vormerkt.
 * danach werden password und passwordcheck miteinander verglichen, wenn sie übereinstimmen 
 * geht es mit den parametern userRef, name, email, password weiter in die Funktion checkNewUserAvailable
 */
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

/**
 * 
 * @param {firebase.database.Reference} userRef eine Referenz die auf das Benutzerverzeichnis verweißt
 * @param {string} name Wert aus dem Eingabefeld name
 * @param {string} email Email Adresse aus dem Eingabefeld email
 * @param {string} password passwort aus dem eingabefeld Passwort
 * Zunächst wird hier die UserDatenbank aus Firebase gefetcht. Sollte dies erfolgreich sein wird in der 
 * const user wir dann überprüft ob der eingegebene Name aus name bereits in der Datenbank vorkommt.
 * sobald die .find Methode einen treffer hat wird die const user disen Wert abspeichern.
 * Danach wird abgefragt ob user einen wert hat, ist dies so geht es in der Funktion setUserToFirebase
 * weiter. Ansonsten geht es in der Funktion userInUse weiter.
 */
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

/**
 * diese Funktion wird aufgerufen falls der User beim registrieren das kontrollpasswort falsch eingegeben 
 * hat. Die Message Box msgBox2 wird sichtbar gemacht und bekomtm den Text "password does not Match"
 * Außerdem wird der form submit Button "submitButton" deaktieviert und das Eingabefeld "pwCheck" geleert.
 */
function wrongPwCheck() {
    document.getElementById('msgBox2').classList.remove("visabilityHidden");
    document.getElementById('msgBox2').innerHTML = 'Password does not Match';
    document.getElementById('submitButton').disabled = true;
    document.getElementById('pwCheck').value = '';
}

/**
 * 
 * @param {firebase.database.Reference} userRef eine Referenz die auf das Benutzerverzeichnis verweißt
 * @param {string} name Wert aus dem Eingabefeld name
 * @param {string} email Email Adresse aus dem Eingabefeld email
 * @param {string} password passwort aus dem eingabefeld Passwort
 * In dieser Funktion wird mit der Methode .set der neu angelegte User in Firebase gespeichert.
 * Dazu wird die vorgemerkte Adresse aus userRef genommen um dort name password und email zu hinterlegen
 * Danach wird ClearInput ausgeführt und dann slideIn.
 */
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
/**
 * die Funktion leert die Input Felder des Anmelde Formulars.
 */
function clearInput() {
    document.getElementById('name').value = ''
    document.getElementById('email').value = ''
    document.getElementById('password').value = ''
    document.getElementById('pwCheck').value = ''
}
/**
 * Diese Funktion löst die Transition slideIn aus indem sie dem element signedUpElement
 * die klasse "slide-in" gibt. Es wird ein Timeout gesetzt der nacch 4 sekunden slideOut 
 * mit dem Parameter signedUpElement ausführt.
 */
function slideIn() {
    const signedUpElement = document.getElementById("signedUp");
    signedUpElement.classList.add("slide-in");
    setTimeout(() => slideOut(signedUpElement), 4000);
}

/**
 * 
 * @param {HTMLElement} signedUpElement kleine Karte die dem User anzeigt das er erfolgreichr egistriert wurde.
 * dem elment slideUpElemet wird die klasse slide in genommen und slide out gegeben, was die SlideOut 
 * animation triggert. Nach einem Timer von 4 Sekunden wird slide Out wieder vom HTML elment genommen.
 * 
 */
function slideOut(signedUpElement) {
    signedUpElement.classList.remove("slide-in");
    signedUpElement.classList.add("slide-out");
    setTimeout(() => {
        signedUpElement.classList.remove("slide-out");
    }, 4000);
}

/**
 * die Funktion macht die msbBox2 sichtbar und gibt ihr den Text "Username not available"
 */
function userInUse() {
    document.getElementById('msgBox2').classList.remove("visabilityHidden");
    document.getElementById('msgBox2').innerHTML = 'Username not available';
}

/**
 * diese Funktion stellt sicher das der Submit Button nur dann aktiviert wird wenn auch wirklich 
 * alle benötigten Felder ausgefüllt und die Privacy Policy Checkbox angehackt wurde. Davor ist der 
 * Button deaktiviert und somit nicht klickbar.
 */
function toggleSubmitButton() {
    const submitButton = document.getElementById('submitButton');
    submitButton.disabled = !(document.getElementById('checkBox').checked &&
        document.getElementById('name').value &&
        document.getElementById('email').value &&
        document.getElementById('password').value &&
        document.getElementById('pwCheck').value);
}

/**
 * Diese onclick Funktion schließt das Registrierungs Form und lädt das Login Form wieder in der Container
 */
function backToLogin() {
    document.getElementById('loginContainer').classList.add('login-container');
    document.getElementById('loginContainer').classList.remove('signUpContainer');
    document.getElementById('loginContainer').innerHTML = loginForm()
}