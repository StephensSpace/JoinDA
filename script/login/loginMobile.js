/**
 * UserDatabase ist die Url zum User "Ordner" in der Firebase Datanbank. 
 * Von hier werden die Daten der registrierten User gefetcht
 */
let UserDatabaseURL = "https://joinda-1dd15-default-rtdb.europe-west1.firebasedatabase.app/User/";

/**
 * Event Listerner für die logo Animation. Dieser Enthält mehrere Timeouts um die Abfolge 
 * (zuerst Logo dann "notAUser") regelt
 */
window.addEventListener("load", () => {
    let animationed = sessionStorage.getItem('animation');
    if (!animationed) {
        logoAnimation()
    } else {
        document.getElementById("logo").src = "./assets/img/logo.png";
        document.getElementById("logoContainer").classList.remove('logo-container');
        document.getElementById("logo").classList.add('logo-container-final');
        document.getElementById("loginContainer").classList.remove('dNone');
        document.getElementById("loginContainer").classList.add('login-container');
        document.getElementById("notAUser").classList.remove('visabilityHidden');
        document.getElementById("ppAndLnBox").classList.remove('dNone');
        document.querySelector('.overlay').classList.add('dNone');
    }

});

/**
 * Führt eine mehrstufige Animation für das Logo und die Login-Ansicht aus.
 * 
 * Diese Funktion führt die folgenden Schritte aus:
 * 1. Wartet 3,2 Sekunden, bevor die Animation beginnt.
 * 2. Ändert nach 500 Millisekunden die Quelle des Logos (`src`) auf ein neues Bild (`./assets/img/logo.png`).
 * 3. Fügt der Overlay-Elementklasse `transparent` hinzu, um es schrittweise transparent zu machen.
 * 4. Nach weiteren 400 Millisekunden:
 *    - Entfernt die Klasse `dNone` vom Login-Container und fügt `login-container` hinzu, um ihn sichtbar zu machen.
 *    - Entfernt die Klasse `visabilityHidden` vom "Not a User"-Abschnitt, um ihn sichtbar zu machen.
 *    - Entfernt die Klasse `dNone` von der Box für Profilbild und Login-Name.
 * 5. Blendet das Overlay-Element nach weiteren 2 Sekunden vollständig aus, indem die Klasse `dNone` hinzugefügt wird.
 */
function logoAnimation() {
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
}

/**
 * in der Funktion guestlogin die onclick auf dem Gästelogin button liegt, wird der
 * Gast User aus der Datanbank gefetcht und dann in den sessionStorage als User hinterlegt.
 *  Danach wird dieser auf die welcome Seite weitergeleitet.
 */
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

/**
 * Onclick Funktion für den Login Button für registrierte User. Zunächst wird hier die msgBox
 * wieder versteckt. Diese kann aufgehen fals jemand sein Passwort falsch eingegeben hat.
 * Im nächsten schritt werden mail und password definiert und dem Input mit der ID email bzw
 * passwort zugewiesen.
 * Danach wird die User Datenbank gefetcht um das Ergebnis und die variabeln mail und password
 * an die Funktion checkPW übergeben.
 */
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

/**
 * 
 * @param {HTMLInputElement} mail verweißt auf das input Feld "email"
 * @param {HTMLInputElement} password verweißt auf das Input Feld "password"
 * @param {object} data das gefetchte User Logindaten Object aus Firebase
 * Die const fittingUser ist das Array was bei der .find Methode die auf das Object 
 * data angewandt wird heraus kommt. Sie enthält alle übereinstimmungen von
 * Email und passwort (oder Username und Passwort) die mit den eingaben des Benutzers in die 
 * Input Felder zusammenpassen.
 * Das if statment überprüft nun ob es einen passenden Benutzer gibt, ist das der fall wird die const
 * rememberMe definiert die auf eine Checkbox verweißt. Ist die Checkbox geklickt nimmt die 
 * Variable den Wert true an. Im folgenden If statement wird falls rememberMe true ist der fittingUser
 * in den LocalStorage geschrieben, um ihn "dauerhaft" einzuloggen.
 * Ist rememberMe false, wird fittingUser in den SessionStorage geschrieben, was bedeutet, das der benutzer
 * sich beim nächsten Login wieder manuel einloggen muss.
 * Ist fittingUser false, also existiert der user nicht wird die msgBox angezeigt die den Benutzer darüber
 * informiert.
 */
function checkPw(mail, password, data) {
    const fittingUser = Object.values(data).find(user => (user.email == mail.value || user.name == mail.value) && user.password == password.value);
    if (fittingUser) {
        const rememberMe = document.getElementById('rememberMee').checked;
        if (rememberMe) {
            localStorage.setItem("User", fittingUser.name);
        } else {
            sessionStorage.setItem("User", fittingUser.name);
        }
        window.location.href = "welcome.html";
    } else {
        document.getElementById('msgBox').classList.remove('dNone');
        document.getElementById('msgBox').classList.add('dBlock');
    }
}

/**
 * onclick funktion für den SignUp Button, öffnet in der Mobilen Ansicht das overlay "loginContainer" 
 * und rendert das HTML Template "SignUpForm()" in den Container.
 */
function loadRegister() {
    document.getElementById('loginContainer').classList.remove('login-container');
    document.getElementById('loginContainer').classList.add('signUpContainer');
    document.getElementById('notAUser').classList.add('dNone');
    document.getElementById('loginContainer').innerHTML = signUpForm();
}