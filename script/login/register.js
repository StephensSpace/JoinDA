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
 * Überprüft, ob das eingegebene Passwort mit einem vorgegebenen Wert übereinstimmt, 
 * und zeigt eine Fehlermeldung an, wenn dies nicht der Fall ist.
 * 
 * @param {string} value - Der Wert, mit dem das eingegebene Passwort verglichen werden soll.
 * 
 * Diese Funktion:
 * - Ruft den aktuellen Wert des Passwortfeldes mit der ID `password` ab.
 * - Überprüft, ob der eingegebene Wert mit dem übergebenen Parameter `value` übereinstimmt:
 *   - Wenn die Werte übereinstimmen, wird die Klasse `visabilityHidden` zum Nachrichtenfeld (`msgBox2`) hinzugefügt, um es auszublenden.
 *   - Wenn die Werte nicht übereinstimmen, wird die Klasse `visabilityHidden` vom Nachrichtenfeld entfernt, um die Fehlermeldung anzuzeigen.
 * - Setzt den Text des Nachrichtenfeldes auf "Password does not Match", wenn die Passwörter nicht übereinstimmen.
 */
function checkPassword(value) {
    let password = document.getElementById('password').value
    let messageBox = document.getElementById('msgBox2')
    password == value ? messageBox.classList.add("visabilityHidden") : messageBox.classList.remove("visabilityHidden"),
    messageBox.innerHTML = 'Password does not Match';
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
    backToLogin();
}
/**
 * die Funktion leert die Input Felder des Anmelde Formulars.
 */
function clearInput() {
    document.getElementById('name').value = ''
    document.getElementById('email').value = ''
    document.getElementById('password').value = ''
    document.getElementById('pwCheck').value = ''
    document.getElementById('checkBox').checked = false
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
        checkMail(document.getElementById('email').value) &&
        document.getElementById('password').value == document.getElementById('pwCheck').value);
}

/**
 * Diese onclick Funktion schließt das Registrierungs Form und lädt das Login Form wieder in der Container
 */
function backToLogin() {
    document.getElementById('loginContainer').classList.add('login-container');
    document.getElementById('loginContainer').classList.remove('signUpContainer');
    document.getElementById('notAUser').classList.remove('dNone');
    document.getElementById('loginContainer').innerHTML = loginForm()
}

/**
 * Überprüft, ob die eingegebene E-Mail-Adresse gültig ist, und zeigt eine Fehlermeldung an, wenn dies nicht der Fall ist.
 * 
 * @param {string} value - Die zu überprüfende E-Mail-Adresse.
 * @returns {boolean} - Gibt `true` zurück, wenn die E-Mail-Adresse gültig ist, andernfalls keine Rückgabe.
 * 
 * Diese Funktion:
 * - Ruft die Validierungsfunktion `isValidEmail` auf, um die Gültigkeit der E-Mail-Adresse zu überprüfen.
 * - Zeigt eine Fehlermeldung im Nachrichtenfeld mit der ID `msgBoxMail` an, wenn die E-Mail ungültig ist:
 *   - Entfernt die Klasse `dNone`, um das Nachrichtenfeld sichtbar zu machen.
 *   - Setzt den Text des Nachrichtenfeldes auf "Please enter a valid E-Mail adress".
 * - Blendet das Nachrichtenfeld aus, wenn die E-Mail-Adresse gültig ist, indem die Klasse `dNone` hinzugefügt wird.
 * - Gibt `true` zurück, wenn die E-Mail-Adresse gültig ist.
 */
function checkMail(value) {
    const msgBoxMail = document.getElementById('msgBoxMail');

    if (!isValidEmail(value)) {
        msgBoxMail?.classList.remove('dNone');
        msgBoxMail.innerHTML = 'Please enter a valid E-Mail adress';
    } else {
        msgBoxMail?.classList.add('dNone');
        return true 
    }
}

/**
 * Überprüft, ob eine gegebene E-Mail-Adresse die grundlegenden Validierungskriterien erfüllt.
 * 
 * @param {string} value - Die zu validierende E-Mail-Adresse.
 * @returns {boolean} - Gibt `true` zurück, wenn die E-Mail-Adresse gültig ist, andernfalls `false`.
 * 
 * Validierungskriterien:
 * - Die E-Mail-Adresse muss ein `@`-Symbol enthalten.
 * - Die E-Mail-Adresse muss einen Punkt (`.`) enthalten.
 * - Das `@`-Symbol muss vor dem letzten Punkt stehen.
 * - Es müssen mindestens zwei Zeichen nach dem letzten Punkt vorhanden sein.
 */
function isValidEmail(value) {
    if (!value) return false;
  
    const hasAtSymbol = value.includes("@");
    const hasDot = value.includes(".");
    const atBeforeDot = value.indexOf("@") < value.lastIndexOf(".");
    const hasTwoLettersAfterDot = value.slice(value.lastIndexOf(".") + 1).length >= 2;
  
    return hasAtSymbol && hasDot && atBeforeDot && hasTwoLettersAfterDot;
  }