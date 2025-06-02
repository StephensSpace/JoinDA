// Für Mobile 2 von 2

/**
 * Löscht die gesamten Kontakt-Informationen aus Firebase und rendert die Seite neu.
 * 
 * @async
 * @function deleteContact
 * @param {number} userIndex Der Index des Kontakts in der Kontaktliste
 * @returns {Promise<void>} Ein Promise, das darauf wartet, dass alle Änderungen durchgeführt und die Anzeige aktualisiert wird.
 */
async function deleteContact(userIndex) {
    const OBJECT = await getFirebaseData(path = "/contacts");
    const USER = Object.keys(OBJECT)[userIndex];
    try {
        const dataRef = firebase.database().ref("/contacts/" + `${USER}`); // Erstelle eine Referenz zu den Daten
        await dataRef.remove(); // Lösche die Daten
    } catch (error) {
    }
    closeModal();
}

/**
 * Fragt die Inputfelder ab und pusht/ speichert sie in Firebase.
 * 
 * @async
 * @function addNewContact
 * @returns {Promise<void>} Ein Promise, das darauf wartet, dass alle Änderungen durchgeführt und die Anzeige aktualisiert wird.  
 */
async function addNewContact() {
    const CHECK_INPUT_NAME = document.getElementById('inputName').value;
    const EMAIL = (document.getElementById('inputEmail').value.split(' ')[0][0].toUpperCase() + document.getElementById('inputEmail').value.split(' ')[0].slice(1)); // make firstletter uppercase
    const PHONE_NUMB = document.getElementById('inputPhone').value;
    if (CHECK_INPUT_NAME.includes(" ")) {   // checkt ob vor- & nachname vorhanden sind
        const NAME = ((document.getElementById('inputName').value.split(' ')[0][0].toUpperCase() + document.getElementById('inputName').value.split(' ')[0].slice(1)) 
        + " " + 
        (document.getElementById('inputName').value.split(' ')[1][0].toUpperCase() + document.getElementById('inputName').value.split(' ')[1].slice(1))); // make firstname + lastname with uppercase firstletters
        const dataRef = firebase.database().ref("/contacts/" + NAME); 
        addNewContactIfElse(NAME, EMAIL, PHONE_NUMB, dataRef);  
    } else {
        const NAME = (document.getElementById('inputName').value.split(' ')[0][0].toUpperCase() + document.getElementById('inputName').value.split(' ')[0].slice(1));   // If we only have the firstname
        const dataRef = firebase.database().ref("/contacts/" + NAME); 
        addNewContactIfElse(NAME, EMAIL, PHONE_NUMB, dataRef);  
    }
}

/**
 * Auslagerungsfunktion, überprüft ob die Eingabe leer ist.
 * 
 * @async 
 * @function addNewContactIfElse
 * @param {number} userIndex Der Index des Kontakts in der Kontaktliste
 * @param {string} NAME String mit dem übergebenen Kontakt Namen
 * @param {string} EMAIL String mit dem übergebenen Kontakt E-Mail
 * @param {string} PHONE_NUMB String mit dem übergebenen Kontakt Telefonnummer
 * @param {firebase.database.Reference} dataRef - Path des geladenen Kontakts in Firebase 
 * @returns {Promise<void>} Ein Promise, das darauf wartet, dass alle Änderungen durchgeführt und die Anzeige aktualisiert wird.  
 */
function addNewContactIfElse(NAME, EMAIL, PHONE_NUMB, dataRef) {
    if (NAME == '' || EMAIL == '' || PHONE_NUMB == '') {
        window.alert('Bitte Kontakt Daten eingeben!')
    } else {
        addNewContactTryCatch(NAME, EMAIL, PHONE_NUMB, dataRef);
        renderContactsInToContactList();
        closeModal();
    }
}

/**
 * Bekomme die Position (Index) des Kontakts aus der Firebase.
 * 
 * @async
 * @function getUserIndex
 * @param {string} NAME String mit dem übergebenen Kontakt Namen
 * @returns {number} gibt die Zahl (Index) des Kontakts aus der Firebase zurück
 */
async function getUserIndex(NAME) {
    const OBJECT = await getFirebaseData(path = "/contacts");
    for (let i = 0; i < await getContactsLength(); i++) {
        const USER = Object.entries(OBJECT)[i][0];
        if (USER == NAME) {
            return i;
        } 
    }
}

/**
 * @async
 * @function addNewContactTryCatch
 * @param {string} NAME String mit dem übergebenen Kontakt Namen
 * @param {string} EMAIL String mit dem übergebenen Kontakt E-Mail
 * @param {string} PHONE_NUMB String mit dem übergebenen Kontakt Telefonnummer
 * @param {firebase.database.Reference} dataRef - Path des geladenen Kontakts in Firebase 
 * @returns {Promise<void>} Ein Promise, das darauf wartet, dass alle Änderungen durchgeführt und die Anzeige aktualisiert wird. 
 */
async function addNewContactTryCatch(NAME, EMAIL, PHONE_NUMB, dataRef) {
    try {
        await dataRef.set ({
            name: NAME,
            email: EMAIL,
            phone_number: PHONE_NUMB,
        })
        const userIndex = await getUserIndex(NAME); // get userIndex of Firebase 
        await renderContactTableTemplate(userIndex, NAME, EMAIL, PHONE_NUMB); // rendert User Information in Content-Table 
    } catch (error) {
    }
}

/**
 * Abfrage wann "user-contact" fertig geladen ist um userIconTemplateContactTable die Color zuvergeben.
 * 
 * @async
 * @function renderContactTableTemplate
 * @param {number} userIndex Der Index des Kontakts in der Kontaktliste
 * @param {string} NAME String mit dem übergebenen Kontakt Namen
 * @param {string} EMAIL String mit dem übergebenen Kontakt E-Mail
 * @param {string} PHONE_NUMB String mit dem übergebenen Kontakt Telefonnummer
 * @returns {Promise<void>} Ein Promise, das darauf wartet, dass alle Änderungen durchgeführt und die Anzeige aktualisiert wird.  
 */
async function renderContactTableTemplate(userIndex, NAME, EMAIL, PHONE_NUMB) {
    const checkContactsLoaded = setInterval(async () => {
        const contactsLoaded = document.getElementsByClassName('user-contact').length;
        const contactsExpected = await getContactsLength();
        if (contactsLoaded === contactsExpected) {
            clearInterval(checkContactsLoaded); // Stop checking
            const CONTACT_CONTENT_TABLE = document.getElementById('contact-content-table');
            CONTACT_CONTENT_TABLE.innerHTML = "";
            CONTACT_CONTENT_TABLE.innerHTML = contactContentTableTemplate(userIndex, NAME, EMAIL, PHONE_NUMB);
        }
    }, 100); // Check every 100ms
}

/**
 * Bekomme die Background Color für vordefinierte Buchstaben kombinationen zurück.
 * 
 * @function getBackgroundForDefinedLetters
 * @param {string} getFirstLetters ersten Buchstaben vom Vor- und Nachnamen
 * @returns {string} gibt den Farbcode in Hexadezimal zurück.
 */
function getBackgroundForDefinedLetters(getFirstLetters) {
    let loopLength = Object.keys(BACKGROUND_COLORS_LETTERS.defined).length;
    for (let i = 0; i < loopLength; i++) {
        let compareLetters = Object.entries(BACKGROUND_COLORS_LETTERS.defined)[i][0];
        if (getFirstLetters === compareLetters) {
            return Object.entries(BACKGROUND_COLORS_LETTERS.defined)[i][1];
        }
    }
    let randomIndex = Math.floor((Math.random() * 7)); // Wenn kein passendes Element in der Schleife gefunden wurde
    let getRandomColor = Object.entries(BACKGROUND_COLORS_LETTERS.undefined)[randomIndex][1];
    return getRandomColor;
}

/**
 * Bekomme die Background Color für undefinierte Buchstaben kombinationen  zurück.
 * Und vergleicht gleichzeitig die Background Color von dem vorher gerenderten Nutzer,
 * damit keine Farbe zweimal hintereinander gerendert wird. 
 * 
 * @function getRandomeColor
 * @param {string} color ersten Buchstaben vom Vor- und Nachnamen
 * @returns {string} gibt den passenden Farbcode in Hexadezimal zurück.
 */
function getRandomeColor(color) {
    let colorOftheAboveIcon = color;
    let randomIndex = Math.floor((Math.random() * 7)); // Wenn kein passendes Element in der Schleife gefunden wurde
    let getRandomColor = Object.entries(BACKGROUND_COLORS_LETTERS.undefined)[randomIndex][1];
    if (colorOftheAboveIcon == getRandomColor) {
        getRandomeColor(color);
    } 
    return getRandomColor;
}

/**
 * Untersucht die Background Color vom vorherig geladenen Kontakt und konvertiert diese
 * in Hexadezimal und gibt diese zurück.
 * 
 * @function rgbInHexa
 * @param {number} userIndex Der Index des Kontakts in der Kontaktliste
 * @returns {string} gibt den Farbcode in Hexadezimal zurück
 */
function rgbInHexa(userIndex) {
    if (document.getElementById(`userIconContactList_${(userIndex-1)}`) !== null) {
        let getIconFromAbove = document.getElementById(`userIconContactList_${(userIndex-1)}`).style.backgroundColor;   // auf den vorherigen UserIcon zugreifen und farbcode ziehen in rgb
        let rgbNumb1_2 = parseInt(getIconFromAbove.replace(/^rgba?\(|\s+|\)$/g, '').split(',')[0]);
        let rgbNumb3_4 = parseInt(getIconFromAbove.replace(/^rgba?\(|\s+|\)$/g, '').split(',')[1]);
        let rgbNumb5_6 = parseInt(getIconFromAbove.replace(/^rgba?\(|\s+|\)$/g, '').split(',')[2]);
        let hexaNumb1_2 = rgbNumb1_2.toString(16).padStart(2, '0').toUpperCase();   // konverte die zahlen zu hexadezimal zahlen   
        let hexaNumb3_4 = rgbNumb3_4.toString(16).padStart(2, '0').toUpperCase();   // konverte die zahlen zu hexadezimal zahlen
        let hexaNumb5_6 = rgbNumb5_6.toString(16).padStart(2, '0').toUpperCase();   // konverte die zahlen zu hexadezimal zahlen
        let hexaNumb = '#' + hexaNumb1_2 + hexaNumb3_4 + hexaNumb5_6;
        return hexaNumb;
    }
}

/**
 * Fügt Margin-Bottom bei dem letzten gerenderten Kontakt in der Kontaktliste hinzu.
 * 
 * @function addMarginOnLastUser
 * @returns {void} Gibt keinen Wert zurück.
 * 
 */
function addMarginOnLastUser() {
    let lengthOfCurrentUsersInList = document.getElementsByClassName("user-contact").length;
    let lastUserInList = document.getElementsByClassName("user-contact")[(lengthOfCurrentUsersInList - 1)];
    lastUserInList.style.marginBottom = ("20px");
}

/**
 * Funktion die zeigt welcher Kontakt in der Kontaktliste angeklickt wurde.
 * 
 * @function clickedUser
 * @param {number} userIndex Der Index des Kontakts in der Kontaktliste
 * @returns {void} Gibt keinen Wert zurück.
 */
function clickedUser(userIndex) {
    const contacts = document.getElementsByClassName('user-contact');
    const contactClicked = document.getElementsByClassName('user-contact')[userIndex];
    contactClicked.classList.add('clicked-Background')
    for (let i = 0; i < contacts.length; i++) {
        const element = contacts[i];
        if (i == userIndex) {
            contactClicked.classList.add('clicked-Background')
        } else {   
            element.classList.remove('clicked-Background');
        }
    }
}

/**
 *      Für das Add-Template (Kontakt hinzufügen)
*/

let buffer = [];

/**
 * Überprüft die angegebene E-Mail-Adresse und aktualisiert die Benutzeroberfläche sowie den Validierungspuffer entsprechend.
 *
 * @function checkMail
 * @param {string} value - Die zu überprüfende E-Mail-Adresse.
 * @returns {boolean} - Gibt `true` zurück, wenn die E-Mail-Adresse gültig ist, ansonsten `undefined`.
 */
function checkMail(value) {
    const msgBoxMail = document.getElementById('msgBoxMail');

    if (!value?.includes("@") || !value?.includes(".")) {
        msgBoxMail?.classList.remove('dNone');
        msgBoxMail.innerHTML = 'Please enter a valid E-Mail adress';
        buffer.splice(0, 1 ,"");
        checkInputValid()
    } else {
        msgBoxMail?.classList.add('dNone');
        return true & buffer.splice(0, 1, "trueMail") & checkInputValid()
    }
}

/**
 * Überprüft die angegebene Telefonnummer und aktualisiert die Benutzeroberfläche sowie den Validierungspuffer entsprechend.
 *
 * @function checkPhone
 * @param {string} value - Die zu überprüfende Telefonnummer.
 * @returns {boolean} - Gibt `true` zurück, wenn die Telefonnummer gültig ist, ansonsten `undefined`.
 *
 */
function checkPhone(value) {
    const msgBoxTel = document.getElementById('msgBoxTel');

    if (!/^[0-9+\-\/]+$/.test(value)) {
        msgBoxTel?.classList.remove('dNone');
        msgBoxTel.innerHTML = 'Please only enter Numbers / + and -';
        buffer.splice(1, 2, "");
        checkInputValid()
    } else {
        msgBoxTel?.classList.add('dNone');
        return true & buffer.splice(1, 2, "truePhone") & checkInputValid()
    }
}

/**
 * Überprüft die Validität der Eingaben und aktiviert oder deaktiviert den "Kontakt erstellen"-Button basierend auf den Ergebnissen.
 *
 * @function checkInputValid
 */
function checkInputValid() {
    if (document.getElementById('inputName').value == '' || !(buffer[0] == 'trueMail') || !(buffer[1] == 'truePhone')) {
        document.getElementById('createContactBtn_addContact').style.background = '';
        document.getElementById('createContactBtn_addContact').type = '';
        document.getElementById('createContactBtn_addContact').style.pointerEvents = 'none';
    } else {
        document.getElementById('createContactBtn_addContact').style.background = '#2a3647';
        document.getElementById('createContactBtn_addContact').type = 'submit';
        document.getElementById('createContactBtn_addContact').style.pointerEvents = '';
    }
}

/**
 *      Für das Edit-Template (Kontakt bearbeiten)
*/

let bufferEdit = [];

/**
 * Überprüft die angegebene E-Mail-Adresse und aktualisiert die Benutzeroberfläche sowie den Validierungspuffer entsprechend.
 *
 * @function checkMail
 * @param {string} value - Die zu überprüfende E-Mail-Adresse.
 * @returns {boolean} - Gibt `true` zurück, wenn die E-Mail-Adresse gültig ist, ansonsten `undefined`.
 */
function checkMailEdit(value) {
    const msgBoxMail = document.getElementById('msgBoxMail');
    
    if (!value?.includes("@") || !value?.includes(".")) {
        msgBoxMail?.classList.remove('dNone');
        msgBoxMail.innerHTML = 'Please enter a valid E-Mail adress';
        bufferEdit.splice(0, 1 ,"");
        checkInputValidEdit()
    } else {
        msgBoxMail?.classList.add('dNone');
        return true & bufferEdit.splice(0, 1, "trueMail") & checkInputValidEdit()
    }
}

/**
 * Überprüft die angegebene Telefonnummer und aktualisiert die Benutzeroberfläche sowie den Validierungspuffer entsprechend.
 *
 * @function checkPhone
 * @param {string} value - Die zu überprüfende Telefonnummer.
 * @returns {boolean} - Gibt `true` zurück, wenn die Telefonnummer gültig ist, ansonsten `undefined`.
 *
 */
function checkPhoneEdit(value) {
    const msgBoxTel = document.getElementById('msgBoxTel');
    
    if (!/^[0-9+\-\/]+$/.test(value)) {
        msgBoxTel?.classList.remove('dNone');
        msgBoxTel.innerHTML = 'Please only enter Numbers / + and -';
        bufferEdit.splice(1, 2, "");
        checkInputValidEdit()
    } else {
        msgBoxTel?.classList.add('dNone');
        return true & bufferEdit.splice(1, 2, "truePhone") & checkInputValidEdit()
    }
}

/**
 * Überprüft die Validität der Eingaben und aktiviert oder deaktiviert den "Kontakt erstellen"-Button basierend auf den Ergebnissen.
 *
 * @function checkInputValid
 */
function checkInputValidEdit() {
    if (document.getElementById('inputName').value == '' || !(bufferEdit[0] == 'trueMail') || !(bufferEdit[1] == 'truePhone')) {
        document.getElementById('createContactBtn').style.background = '';
        document.getElementById('createContactBtn').type = '';
        document.getElementById('createContactBtn').style.pointerEvents = 'none';
    } else {
        document.getElementById('createContactBtn').style.background = '#2a3647';
        document.getElementById('createContactBtn').type = 'submit';
        document.getElementById('createContactBtn').style.pointerEvents = '';
    }
}