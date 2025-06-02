/**
 * Überprüft, ob ein Benutzer angemeldet ist, und leitet die Initialisierung ein.
 * 
 * Diese Funktion:
 * - Prüft, ob die globale Variable `logedUser` nicht definiert oder `null` ist.
 *   - Wenn `logedUser` undefiniert oder `null` ist:
 *     - Ruft `checkStorageForUser` auf, um den angemeldeten Benutzer aus dem Speicher abzurufen.
 *     - Übergibt den Benutzer an die Funktion `selectInitials`.
 *   - Wenn `logedUser` bereits definiert ist:
 *     - Ruft `selectInitials` ohne Parameter auf.
 */
function checkLogedUser() {
    if (typeof window.logedUser === "undefined" || logedUser === null) {
        let logedUser = checkStorageForUser(); // logedUser nur definieren, wenn sie nicht existiert
        selectInitials(logedUser);
    } else {
        selectInitials();
    }
}

/**
 * Überprüft, ob ein Benutzer im Session- oder Local-Storage gespeichert ist.
 * 
 * @returns {string|void} - Gibt den Benutzer als String zurück, wenn er im Speicher gefunden wird.
 *                          Wenn kein Benutzer gefunden wird, wird die Seite auf `login.html` umgeleitet.
 * 
 * Diese Funktion:
 * - Sucht zuerst im Session-Storage nach einem Benutzer mit dem Schlüssel `User`.
 * - Falls dort kein Benutzer gefunden wird, wird der Local-Storage durchsucht.
 * - Gibt den gefundenen Benutzer zurück.
 * - Leitet den Benutzer auf die Login-Seite weiter, falls kein Benutzer im Speicher vorhanden ist.
 */
function checkStorageForUser() {
    const user = sessionStorage.getItem('User') || localStorage.getItem('User');
    if (user) {
        return user;
    } else {
        window.location.href = "login.html";
    }
}

/**
 * Erstellt die Initialen eines angemeldeten Benutzers und übergibt diese zur Anzeige.
 * 
 * @param {string} logedUser - Der vollständige Name des angemeldeten Benutzers.
 * 
 * Diese Funktion:
 * - Überprüft, ob der Name Leerzeichen enthält:
 *   - Wenn ja, werden die Initialen aus dem ersten Buchstaben jedes der ersten beiden Wörter gebildet.
 *   - Wenn nicht, werden die ersten beiden Buchstaben des Namens verwendet.
 * - Die erstellten Initialen werden an `setUserIcon` übergeben.
 */
function selectInitials(logedUser) {
    if (logedUser.includes(" ")) {
        const words = logedUser.split(" ");
        const initials = words[0][0].toUpperCase() + words[1][0].toUpperCase();
        setUserIcon(initials);
    } else {
        const initials = logedUser[0].toUpperCase() + logedUser[1].toUpperCase()
        setUserIcon(initials);
    }
}

/**
 * Setzt die Initialen eines Benutzers in das entsprechende HTML-Element und bestimmt die Farbe.
 * 
 * @param {string} initials - Die Initialen des Benutzers.
 * 
 * Diese Funktion:
 * - Fügt die Initialen in das HTML-Element mit der ID `initials` ein.
 * - Ruft die Funktion `colorPicker` auf, um die Hintergrundfarbe basierend auf den Initialen zu setzen.
 */
function setUserIcon(initials) {
    document.getElementById('initials').innerHTML = `${initials}`;
    colorPicker(initials);
}

/**
 * Legt die Hintergrundfarbe des Benutzerprofils basierend auf den Initialen fest.
 * 
 * @param {string} initials - Die Initialen des Benutzers.
 * 
 * Diese Funktion:
 * - Überprüft den ersten Buchstaben der Initialen.
 * - Basierend auf bestimmten Buchstabengruppen (`A-C`, `D-F`, etc.) wird eine spezifische Farbe ausgewählt.
 * - Wenn keine der Buchstabengruppen passt, wird eine Standardfarbe verwendet.
 */
function colorPicker(initials) {
    if (initials[0] == "A" || "B" || "C") {
        document.getElementById('userProfil').style.background = "#FF7A00"
    } else if (initials[0] == "D" || "E" || "F") {
        document.getElementById('userProfil').style.background = "#9327FF"
    } else if (initials[0] == "G" || "H" || "I") {
        document.getElementById('userProfil').style.background = "#6E52FF"
    } else if (initials[0] == "J" || "K" || "L") {
        document.getElementById('userProfil').style.background = "#FC71FF"
    } else if (initials[0] == "M" || "N" || "O") {
        document.getElementById('userProfil').style.background = "#FFBB2B"
    } else if (initials[0] == "P" || "Q" || "R") {
        document.getElementById('userProfil').style.background = "#1FD7C1"
    } else { document.getElementById('userProfil').style.background = "#462F8A" }
}

checkLogedUser();