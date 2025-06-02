
/**
 * Öffnet das Benutzer-Menü und fügt einen Event-Listener hinzu, um es bei einem Klick außerhalb zu schließen.
 * 
 * Diese Funktion:
 * - Überprüft, ob das Benutzer-Menü (`userMenu`) die Klasse `dNone` enthält:
 *   - Wenn ja:
 *     - Entfernt die Klasse `dNone`, um das Menü anzuzeigen.
 *     - Fügt einen Event-Listener hinzu, der überprüft, ob ein Klick außerhalb des Menüs erfolgt, und schließt das Menü.
 *   - Wenn nein:
 *     - Fügt die Klasse `dNone` hinzu, um das Menü zu schließen.
 * - Der Event-Listener zum Schließen des Menüs wird nach einem kleinen Timeout hinzugefügt, um sicherzustellen, dass der Klick-Event nicht sofort ausgelöst wird.
 */
function openUserMenu() {
    const userMenu = document.getElementById('userMenu');
    if (userMenu.classList.contains('dNone')) {
        userMenu.classList.remove('dNone');
        const closeMenu = function (event) {
            if (!userMenu.contains(event.target)) {
                userMenu.classList.add('dNone'); // Overlay schließen
                document.removeEventListener('click', closeMenu); // Listener entfernen
            }
        };
        setTimeout(() => {
            document.addEventListener('click', closeMenu);
        }, 0);
    } else {
        userMenu.classList.add('dNone');
    };
}

/**
 * Navigiert zu einer rechtlichen Hinweis-Seite basierend auf der aktuellen URL.
 * 
 * Diese Funktion:
 * - Überprüft, ob die aktuelle URL den Begriff "Mobile" enthält:
 *   - Wenn ja, leitet sie auf `legal_noticeMobile.html` weiter.
 *   - Wenn nein, leitet sie auf `legal_notice.html` weiter.
 */
function menuLegalBtn() {
    const currentUrl = window.location.href;
    if (currentUrl.includes("Mobile")) {
        window.location.href = "legal_noticeMobile.html";
    } else {
        window.location.href = "legal_notice.html";
    };
}

/**
 * Navigiert zur Datenschutzerklärung basierend auf der aktuellen URL.
 * 
 * Diese Funktion:
 * - Überprüft, ob die aktuelle URL den Begriff "Mobile" enthält:
 *   - Wenn ja, leitet sie auf `privacy_policyMobile.html` weiter.
 *   - Wenn nein, leitet sie auf `privacy_policy.html` weiter.
 */
function menuPrivacyBtn() {
    const currentUrl = window.location.href;
    if (currentUrl.includes("Mobile")) {
        window.location.href = "privacy_policyMobile.html";
    } else {
        window.location.href = "privacy_policy.html";
    };
}

/**
 * Meldet den Benutzer ab und leitet ihn zur Login-Seite basierend auf der aktuellen URL weiter.
 * 
 * Diese Funktion:
 * - Überprüft, ob die aktuelle URL den Begriff "Mobile" enthält:
 *   - Wenn ja, leitet sie auf `loginMobile.html` weiter.
 *   - Wenn nein, leitet sie auf `login.html` weiter.
 * - Entfernt den Benutzer aus dem `sessionStorage` und `localStorage`.
 * - Entfernt den Eintrag `logedUser` aus `localStorage` und `sessionStorage`.
 */
function logOutBtn() {
    const currentUrl = window.location.href;
    if (currentUrl.includes("Mobile")) {
        window.location.href = "loginMobile.html";
        sessionStorage.removeItem('User')
        localStorage.removeItem('User')
    } else {
        window.location.href = "login.html";
        sessionStorage.removeItem('User')
        localStorage.removeItem('User')
    };
    localStorage.removeItem('logedUser');
    sessionStorage.removeItem('logedUser');
}

/**
 * Navigiert zur Hilfeseite basierend auf der aktuellen URL.
 * 
 * Diese Funktion:
 * - Überprüft, ob die aktuelle URL den Begriff "Mobile" enthält:
 *   - Wenn ja, leitet sie auf `helpMobile.html` weiter.
 *   - Wenn nein, leitet sie auf `help.html` weiter.
 */
function helpBtn() {
    const currentUrl = window.location.href;
    if (currentUrl.includes("Mobile")) {
        window.location.href = "helpMobile.html";
    } else {
        window.location.href = "help.html";
    };
}

/**
 * Navigiert zur Zusammenfassungsseite basierend auf der aktuellen URL.
 * 
 * Diese Funktion:
 * - Überprüft, ob die aktuelle URL den Begriff "Mobile" enthält:
 *   - Wenn ja, leitet sie auf `summaryMobile.html` weiter.
 *   - Wenn nein, leitet sie auf `summary.html` weiter.
 */
function summaryBtn() {
    const currentUrl = window.location.href;
    if (currentUrl.includes("Mobile")) {
        window.location.href = "summaryMobile.html";
    } else {
        window.location.href = "summary.html";
    };
}

/**
 * Navigiert zur Seite zum Hinzufügen einer Aufgabe basierend auf der aktuellen URL.
 * 
 * Diese Funktion:
 * - Überprüft, ob die aktuelle URL den Begriff "Mobile" enthält:
 *   - Wenn ja, leitet sie auf `addTaskMobile.html` weiter.
 *   - Wenn nein, leitet sie auf `addTask.html` weiter.
 */
function addTaskBtn() {
    const currentUrl = window.location.href;
    if (currentUrl.includes("Mobile")) {
        window.location.href = "addTaskMobile.html";
    } else {
        window.location.href = "addTask.html";
    };
}

/**
 * Navigiert zur Board-Seite basierend auf der aktuellen URL.
 * 
 * Diese Funktion:
 * - Überprüft, ob die aktuelle URL den Begriff "Mobile" enthält:
 *   - Wenn ja, leitet sie auf `boardMobile.html` weiter.
 *   - Wenn nein, leitet sie auf `board.html` weiter.
 */
function boardBtn() {
    const currentUrl = window.location.href;
    if (currentUrl.includes("Mobile")) {
        window.location.href = "boardMobile.html";
    } else {
        window.location.href = "board.html";
    };
}

/**
 * Navigiert zur Kontaktseite basierend auf der aktuellen URL.
 * 
 * Diese Funktion:
 * - Überprüft, ob die aktuelle URL den Begriff "Mobile" enthält:
 *   - Wenn ja, leitet sie auf `contactsMobile.html` weiter.
 *   - Wenn nein, leitet sie auf `contacts.html` weiter.
 */
function contactsBtn() {
    const currentUrl = window.location.href;
    if (currentUrl.includes("Mobile")) {
        window.location.href = "contactsMobile.html";
    } else {
        window.location.href = "contacts.html";
    }; 
}