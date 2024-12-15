
const currentDate = new Date();
let logedUser = checkStorageForUser()

/**
 * Diese Funktion lässt die variable hour den Wert der jetzigen Uhrzeit (nur Stunde) annehmen
 * in der switch case abfrage wird geklärt ob hour gerade morgens mittags oder abends ist.
 * je nachdem wird der Text der Greeting Box angepasst.
 * danach führt es in die Funktion setUssername()
 */
function selectGreeting() {
    hour = currentDate.getHours();
    let greetingBox = document.getElementById('daytime');
    if (hour < 12) {  // Good morning
        greetingBox.innerHTML = 'Good morning,';
    } else if (hour >= 12 && hour < 18) {  // Good afternoon
        greetingBox.innerHTML = 'Good afternoon,';
    } else {  // Good evening
        greetingBox.innerHTML = "Good evening,";
    };
    setUsername();
}

/**
 * 
 * @returns Wenn ein user gefunden wurde wird dieser zurückgegeben (und in der Variabeln logedUser gespeichert)
 * die Funktion überprüft ob im Session oder local Storage ein "user" hinterlegt ist.
 * ist das nicht der fall wird zurück auf loginMobile.html geleitet.
 */
function checkStorageForUser() {
    const user = sessionStorage.getItem('User') || localStorage.getItem('User');
    if (user) {
        return user;
    } else {
        window.location.href = "loginMobile.html";
    }
}

/**
 * diese Funktion setzt den logedUser in das innerHTML der userName Box und fährt mit
 * greetingAnimation fort.
 */
function setUsername() {
    document.getElementById('userName').innerHTML = logedUser
    greetingAnimation()
}
/**
 * diese Funktion setzt einen eventListener auf gteetingBox der sobald die animation durchgelaufen ist
 * auf sunnaryMobile.html verlinkt
 */
function greetingAnimation() {
    const greetingBox = document.getElementById('greetingBox');
    greetingBox.addEventListener('animationend', () => {
        window.location.href = 'summaryMobile.html';
    });
}