// Für Desktop

// Globale Variabeln
const logedUser = sessionStorage.getItem('User'); // für Stephen 
const BACKGROUND_COLORS_LETTERS = {
    "defined": {
        "AM": "#FF7A00",
        "AS": "#9327FF",
        "BZ": "#6E52FF",
        "DE": "#FC71FF",
        "EF": "#FFBB2B",
        "EM": "#1FD7C1",
        "MB": "#462F8A",
        "TW": "#FF4646",
        "SM": "#00BEE8",
    },
    "undefined": {
        "0": "#FF745E",
        "1": "#FFC701",
        "2": "#FFE62B",
        "3": "#FF5EB3",
        "4": "#FFA35E",
        "5": "#0038FF",
        "6": "#C3FF2B",
    }
}

/**
 * Initialisierung indem die Seite geladen wird, wir beim laden vom Body neuladen.
 * @async
 * @function initContacts 
 * @returns {Promise<object>} Ein Promise, das den gesament Kontent rein rendert, 
 * der beim neuladen der Seite standartmäßig reingeladen wird.
 */
async function initContacts() {
    await renderAll();
}

/**
 * Eine Sammlung der Dinge die direkt reingerendert werden.
 * 
 * @async
 * @function renderAll
 * @returns {Promise<object>} Ein Promise, das den gesament Kontent rein rendert.
 */
async function renderAll() {
    await renderContactsInToContactList();
}

/**
 * Bekomme die allgemeinen Daten aus der Firebase, [path = "/"] 
 * verweist hierbei auf den Hauptordner in Firebase.
 * @async
 * @function getFirebaseData
 * @param {string} path gibt alle Ordner auf die in Firebase zugegriffen werden soll, zurück.
 * Standardmäßig wird die Wurzel ("/") verwendet. 
 * @returns {Promise<object>} Ein Objekt, das die Ordner auf die zugeriffen werden soll zurück.
 * @example await getFirebaseData("/contacts") führt in den Unterordner "Contacts".
 */
async function getFirebaseData(path = "/") {
    const SNAPSHOT = await firebase.database().ref(path).once('value');
    const RESULT = SNAPSHOT.val(); // Ergebnis als Object
    return RESULT;
}

/**
 * Bekomme die Anzahl der momentanen Kontakte im Verzeichnis "/contacts" in Firebase zurück.
 * @async
 * @function getContactsLength
 * @returns {Promise<number>} gibt die genaue Anzahl der in Firebase vorhandenen Kontakte zurück.
 */
async function getContactsLength() {
    const ALL_CONTACTS = (await getFirebaseData(`contacts/`));
    const LENGTH_OF_ALL_CONTACTS = Object.keys(ALL_CONTACTS).length;
    return LENGTH_OF_ALL_CONTACTS;
}

/**
 * Überprüft übereinstimmenden Buchentaben im "headLetter" & Entfernt "headLetterDiv" bei gleichen Buchstaben
 * @function checkHeadLetter
 * @returns {void} Gibt keinen Wert zurück.
 * @example
 * wenn mehrere Kontakte in der Kontaktliste den gleichen Anfangsbuchstaben haben, dann wird von dem oberen der in der gleichen
 * Unterteilung liegt, die Headletter-Div Entfernt. Da sie bei jedem Benutzer mitgeladen wird. 
 * Headletter-Div ist der Container in dem Bspw. "A" oder "B" steht (also die namliche Trennung). 
 */
function checkHeadLetter() {
    for (let index = 0; index < headLetter.length; index++) {
        let x = headLetter[(index)].innerHTML;
        let y = headLetter[(index + 1)]?.innerHTML;
        if (x == y) {
            headLetterDiv[(index + 1)].remove();
        }
    }
}

/**
 * Gibt den Ersten Buchstaben des Vornamen zurück.
 * @function getFirstnameLetter
 * @param {string} USER_NAME Parameter der den ganzen Namen übergibt.
 * @returns {Promise<string>} Ein String, der den ersten Buchstaben des Vornamens zurück gibt.
 * @example USER_NAME = "Thomas Müller" 
 * Rückgabewert = "T"
 */
function getFirstnameLetter(USER_NAME) {
    let firstLetterFirstname = USER_NAME;
    let getFirstLetter = firstLetterFirstname.split(" ")[0][0]   // Teilt den String in Wörter auf + nimmt das erste Wort + nimmt den ersten Buchstaben des ersten Worts
    return getFirstLetter;
}

/**
 * Diese Funktion stoppt die Propagation eines Ereignisses im DOM, 
 * sodass es nicht an übergeordnete Elemente weitergegeben wird.
 * 
 * @function eventBubbling
 * @param {Event} event das Ereignis-Objekt, dessen Propagation gestoppt werden soll.
 * @returns {void} Gibt keinen Wert zurück.
 */
function eventBubbling(event) {
    event.stopPropagation();
}

/**
 * Schließt das Modal für "Add new Contact" und "Edit Contact".
 * @function closeModal
 * @returns {void} Gibt keinen Wert zurück.
 */
function closeModal() {
    document.getElementsByTagName('modal')[0]?.remove();
    buffer = [];
}

/**
 * Fügt das Modal in "Conctact-Content" als erstes an und öffnet das Modal "Add Contact".
 * @function openAddContactModal
 * @returns {void} Gibt keinen Wert zurück.
 */
function openAddContactModal() {
    const CONTACT_CONTENT_REF = document.getElementsByClassName('content')[0];
    CONTACT_CONTENT_REF.insertAdjacentHTML("afterbegin", modalAddContactTemplate());
    checkInputValid()
}

/**
 * Gibt die geanueren Kontakt-Informationen aufgrund des userIndex des Benutzers in der Kontaktliste zurück.
 * Diese Funktion greift auf die Firebase-Datenbank zu, um Benutzerdaten wie Name, E-Mail und Telefonnummer 
 * zu laden. Die Daten werden anhand des Benutzerindexes aus der Liste der Kontakte extrahiert.
 * 
 * @async
 * @function getUserInfos
 * @param {number} userIndex Der Index des Kontakts in der Kontaktliste
 * @returns {Promise<{userIndex: number; USER_NAME: string; USER_EMAIL: string; USER_PHONE_NUMB: string;}>}
 * Ein Promise, das ein Objekt mit den Benutzerinformationen zurückgibt:
 * - `userIndex` (number): Der Parameter zur übergabe des Index des Benutzers.
 * - `USER_NAME` (string): Der Name des Benutzers.
 * - `USER_EMAIL` (string): Die E-Mail-Adresse des Benutzers.
 * - `USER_PHONE_NUMB` (string): Die Telefonnummer des Benutzers.
 * @example 
 * await function getUserInfos(1);
 * USER_NAME        = "Benedikt Ziegler";
 * USER_EMAIL       = "Benedikt@gmail.com";
 * USER_PHONE_NUMB  = "+49 1111 111 11 3";
 */
async function getUserInfos(userIndex) {
    const OBJECT = await getFirebaseData(path = "/contacts");
    const USER = Object.keys(OBJECT)[userIndex];
    const USER_NAME = (await getFirebaseData(`contacts/${USER}`)).name;
    const USER_EMAIL = (await getFirebaseData(`contacts/${USER}`)).email;
    const USER_PHONE_NUMB = (await getFirebaseData(`contacts/${USER}`)).phone_number;
    return { userIndex, USER_NAME, USER_EMAIL, USER_PHONE_NUMB }
}

/**
 * Funktion zum rein rendern der vorhandenen Kontakte in die Kontaktliste.
 * 
 * @async
 * @function renderContactsInToContactList
 * @returns {void} Gibt keinen Wert zurück.
 */
async function renderContactsInToContactList() {
    const CONTACTS_LIST = document.getElementById('contactList');
    CONTACTS_LIST.innerHTML = "";
    for (let userIndex = 0; userIndex < await getContactsLength(); userIndex++) {
        const { USER_NAME, USER_EMAIL } = await getUserInfos(userIndex);
        getFirstnameLetter(USER_NAME);                    // Übergebe User Namen
        contactBoardFirstLetterHeadTemplate(USER_NAME);   // Übergebe User Namen
        CONTACTS_LIST.innerHTML += contactBoradUserTemplate(USER_NAME, USER_EMAIL, userIndex)
        checkHeadLetter();
    }
    addMarginOnLastUser();
}

/**
 * Funktion zum rein rendern der Kontakt-Informationen in den Content-Table.
 * 
 * @async
 * @function renderContactInfosInContactsTable
 * @param {number} userIndex Der Index des Kontakts in der Kontaktliste
 * @returns {void} Gibt keinen Wert zurück.
 */
async function renderContactInfosInContactsTable(userIndex) {
    const OBJECT = await getFirebaseData(path = "/contacts");
    clickedUser(userIndex);
    const USER = Object.keys(OBJECT)[userIndex];
    const CONTACT_CONTENT_TABLE = document.getElementById('contact-content-table');
    const { USER_NAME, USER_EMAIL, USER_PHONE_NUMB } = await getUserInfos(userIndex);
    if (document.getElementById(`userIconContactList_${userIndex}`).innerHTML == document.getElementById(`userIconContactTable-${userIndex}`)?.innerHTML) {

    } else {
        CONTACT_CONTENT_TABLE.innerHTML = contactContentTableTemplate(userIndex, USER_NAME, USER_EMAIL, USER_PHONE_NUMB);
    }
}

/**
 * Auslagerungsfunktion von dem Input-Referenzen im Edit- und Contact Modal.
 * Gibt die Inputfelder als Referenz zurück, welche im nächsten Schritt abgefragt werden können.
 * 
 * @function getInputfieldContactModalInfos
 * @returns {string} Mehrere Strings mit den DOM-Elementen der Eingabefelder:
 * - `inputfieldName` (HTMLElement): Das Eingabefeld für den Namen des Kontakts.
 * - `inputfieldEmail` (HTMLElement): Das Eingabefeld für die E-Mail-Adresse des Kontakts.
 * - `inputfieldPhone` (HTMLElement): Das Eingabefeld für die Telefonnummer des Kontakts.
 * 
 */
function getInputfieldContactModalInfos() {
    const inputfieldName = document.getElementById('inputName');
    const inputfieldEmail = document.getElementById('inputEmail');
    const inputfieldPhone = document.getElementById('inputPhone');
    return { inputfieldName, inputfieldEmail, inputfieldPhone }
}

/**
 * Öffnet das Edit-Contact Modal und fügt alle Daten der jeweilig zu bearbeitenden Kontakts ein.
 * @async
 * @function openEditContactModal
 * @param {number} userIndex Der Index des Kontakts in der Kontaktliste
 * @returns {void} Gibt keinen Wert zurück. 
 */
async function openEditContactModal(userIndex) {
    const CONTACT_CONTENT_REF = document.getElementsByClassName('content')[0];
    const { USER_NAME, USER_EMAIL, USER_PHONE_NUMB } = await getUserInfos(userIndex);
    CONTACT_CONTENT_REF.insertAdjacentHTML("afterbegin", modalEditContactTemplate(userIndex, USER_NAME));
    const { inputfieldName, inputfieldEmail, inputfieldPhone } = getInputfieldContactModalInfos();
    inputfieldName.value = USER_NAME;
    inputfieldEmail.value = USER_EMAIL;
    inputfieldPhone.value = USER_PHONE_NUMB;
    checkMailEdit(document.getElementById('inputEmail').value);
    checkPhoneEdit(document.getElementById('inputPhone').value);
}

/**
 * Zum Checken der Eingabe im Modal, das Fetchen des richtigen Kontakts, das öffnen des Modals und das schließen sowie rein rendern/ löschen
 * des Kontakts in die/ aus die Kontaktliste und dem Content Table.
 * 
 * @async
 * @function editContactInModal
 * @param {number} userIndex Der Index des Kontakts in der Kontaktliste
 * @returns {Promise<void>} Ein Promise, das darauf wartet, dass alle Änderungen durchgeführt und die Anzeige aktualisiert wird.
 */
async function editContactInModal(userIndex) {
    const { inputfieldName, inputfieldEmail, inputfieldPhone } = getInputfieldContactModalInfos();
    const OBJECT = await getFirebaseData(path = "/contacts");
    const USER = Object.keys(OBJECT)[userIndex];
    const dataRef = firebase.database().ref("/contacts/" + `${USER}`);
    editContactInModalTryCatch(userIndex, inputfieldName, inputfieldEmail, inputfieldPhone, dataRef);
    closeModal();
    await renderContactsInToContactList();
    await renderContactInfosInContactsTable(userIndex);
}

/**
 * Auslagerunsfunktion, welche die Daten in die Firebase hochläd/ pusht.
 * Dabei Loggt der in der Console, den erfolgreichen Upload oder meldet Fehler bei 
 * Fehlschlag.
 * 
 * @async
 * @function editContactInModalTryCatch
 * @param {number} userIndex Der Index des Kontakts in der Kontaktliste
 * @param {string} inputfieldName Inputfeld mit dem geänderten/ geladenen Namen aus/ in Firebase
 * @param {string} inputfieldEmail Inputfeld mit der geänderten/ geladenen E-Mail aus/ in Firebase 
 * @param {string} inputfieldPhone Inputfeld mit der geänderten/ geladenen Telefonnummer aus/ in Firebase
 * @param {firebase.database.Reference} dataRef - Path des geladenen Kontakts in Firebase 
 * @returns {Promise<void>} Ein Promise, das darauf wartet, dass alle Änderungen durchgeführt und die Anzeige aktualisiert wird.
 */
async function editContactInModalTryCatch(userIndex, inputfieldName, inputfieldEmail, inputfieldPhone, dataRef) {
    try {
        const NAME = inputfieldName.value;
        const EMAIL = inputfieldEmail.value;
        const PHONE_NUMB = inputfieldPhone.value;
        await dataRef.set({
            name: NAME,
            email: EMAIL,
            phone_number: PHONE_NUMB,
        })
        const CONTACT_CONTENT_TABLE = document.getElementById('contact-content-table');
        CONTACT_CONTENT_TABLE.innerHTML = contactContentTableTemplate(userIndex, NAME, EMAIL, PHONE_NUMB);
    } catch (error) {

    }
}

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
    document.getElementById('contact-content-table').innerHTML = "";
    renderContactsInToContactList();
    closeModal();
}

/**
 * Leert den Contact Table und führt die Funktion "addNewContact" dazu rendert die
 * Div mit "Contact Successfully Created" rein. 
 * 
 * @async
 * @function addNewContactFunc
 * @returns {Promise<void>} Ein Promise, das darauf wartet, dass alle Änderungen durchgeführt und die Anzeige aktualisiert wird. 
 */
async function addNewContactFunc() {
    document.getElementById('contact-content-table').innerHTML = "";
    await addNewContact();
    contactSuccessfullyCreated();
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
        await addNewContactIfElse(NAME, EMAIL, PHONE_NUMB, dataRef);
    } else {
        const NAME = (document.getElementById('inputName').value.split(' ')[0][0].toUpperCase() + document.getElementById('inputName').value.split(' ')[0].slice(1));   // If we only have the firstname
        const dataRef = firebase.database().ref("/contacts/" + NAME);
        await addNewContactIfElse(NAME, EMAIL, PHONE_NUMB, dataRef);
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
async function addNewContactIfElse(NAME, EMAIL, PHONE_NUMB, dataRef) {
    if (NAME == '' || EMAIL == '' || PHONE_NUMB == '') {
        window.alert('Bitte Kontakt Daten eingeben!')
    } else {
        await addNewContactTryCatch(NAME, EMAIL, PHONE_NUMB, dataRef);
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
        await dataRef.set({
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
    if (document.getElementById(`userIconContactList_${(userIndex - 1)}`) !== null) {
        let getIconFromAbove = document.getElementById(`userIconContactList_${(userIndex - 1)}`).style.backgroundColor;   // auf den vorherigen UserIcon zugreifen und farbcode ziehen in rgb
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
 * Funktion für das animierte rein- & wieder rausfliegen der DIV
 * "Contact Successfully Created!".
 * 
 * @function contactSuccessfullyCreated
 * @returns {void} Gibt keinen Wert zurück.
 */
function contactSuccessfullyCreated() {
    document.getElementsByClassName('contact-content')[0].innerHTML += contactSuccessfullyCreatedTemplate();
    const element = document.getElementsByClassName('contactSuccessfullyCreated')[0];
    const delay = 3750;
    setTimeout(() => {
        if (element) {
            element.remove(); // Element aus dem DOM entfernen
        }
    }, delay);
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
        document.getElementById('createContactBtn').style.background = '';
        document.getElementById('createContactBtn').type = '';
        document.getElementById('createContactBtn').style.pointerEvents = 'none';
    } else {
        document.getElementById('createContactBtn').style.background = '#2a3647';
        document.getElementById('createContactBtn').type = 'submit';
        document.getElementById('createContactBtn').style.pointerEvents = '';
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