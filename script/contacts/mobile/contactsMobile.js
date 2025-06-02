// Für Mobile 1 von 2

// Globale Variabeln
const logedUser = sessionStorage.getItem('User'); // für Stephen 
const BACKGROUND_COLORS_LETTERS = {
    "defined":{
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
    "undefined":{
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
 * Fügt neuen Kontakt in den Contact Content Table hinzu 
 * und blendet "Contact Successfully Created!" ein.
 * Dazu wird die Kontaktliste ausgeblendet und den Contact Content Table ein!
 * 
 * @async
 * @function addNewContactMobile
 * @returns {Promise<void>} Ein Promise, das darauf wartet, dass der Kontakt erfolgreich hinzugefügt und die Anzeige aktualisiert wurde.
 * 
 */
async function addNewContactMobile() {
    document.getElementsByClassName('add-new-contact-background')[0].style.display = "none";
    document.getElementsByClassName('contact-board')[0].style.display = "none";
    document.getElementsByClassName('edit-delete-btn-background')[0].style.display = "unset";
    document.getElementsByClassName('contact-content')[0].style.display = "flex";
    await addNewContact ();
    contactSuccessfullyCreated();
    document.getElementById('contact-content-table').innerHTML = "";
}

/**
 * Funktion zum welche die Div mit "Contact Successfully Created!" rein und wieder raus rendert.
 * 
 * @function contactSuccessfullyCreated
 * @returns {void} Gibt keinen Wert zurück.
 */
function contactSuccessfullyCreated() {
    document.getElementsByClassName('contact-content')[0].innerHTML += contactSuccessfullyCreatedTemplate();
    const element = document.getElementsByClassName('contactSuccessfullyCreated')[0];
    const delay = 1750;
    setTimeout(() => {
        if (element) {
            element.remove(); // Element aus dem DOM entfernen
        }
    }, delay);
}

/**
 * Um zwichen Contact Content Table und der Kontaktliste zu wechseln.
 * 
 * @function goBackToContactList
 * @returns {void} Gibt keinen Wert zurück.
 */
function goBackToContactList() {
    document.getElementsByClassName('contact-board')[0].style.display = "unset"; // zeige wieder die Kontaktliste an
    document.getElementById('contact-content-table').innerHTML = ""; // leere den Contact Informations Bereich
    document.getElementsByClassName('edit-delete-btn-background')[0].style.display = "none"; // entfern den edit und delete button in der Kontaktlisten Ansicht
    document.getElementsByClassName('contact-content')[0].style.display = "none"; // Entfernt das Kontakt Details Template von der HTML 
    document.getElementsByClassName('add-new-contact-background')[0].style.display = "unset"; // fügt button "add new contact" hinzu 
}

/**
 * Funktion zum rendern der Kontakte-Details in den Contact Content Table.
 * 
 * @function renderContactInfosInContactsTableMobile
 * @param {number} index Der Index des Kontakts in der Kontaktliste
 * @returns {Promise<void>} Ein Promise, das den gesament Kontent rein rendert in den
 * Contact Content Table.
 */
async function renderContactInfosInContactsTableMobile(index) {
    document.getElementsByClassName('contact-board')[0].style.display = "none"; //document.getElementsByClassName('contact-content')[0].style.display = "flex";
    document.getElementsByClassName('contact-content')[0].style.display = "flex"; //  fügt Kontaktinformation Template + button edit contact hinzu 
    document.getElementsByClassName('edit-delete-btn-background')[0].style.display = "unset"; // mache sichtbar den edit und delete button in der Kontaktlisten Ansicht
    await renderContactInfosInContactsTable(index); // Get Contact information into "contact-content-table"
    document.getElementsByClassName('add-new-contact-background')[0].style.display = "none"; // entfernt den add new contact button in der Kontakt Details Ansicht
}

/**
 * Öffnet das Popup Fenster "contact-content-table-editAndDeleteIcons" durch ein Klick auf die Funktion.
 * In dem Fall, in der Mobile Ansicht unten rechts der Button mit den 3-Punkten.
 * Durch klick auf die Fläche vergibte die Funktion ein Display Flex für die Schaltfläche.
 * 
 * @function openPopupDiv
 * @returns {void} Gibt keinen Wert zurück.
 */
function openPopupDiv() {
    if (document.getElementById('popupDiv') == null) {        // Wenn Popup doc... = true; also wenn er da ist, dann else
        document.getElementsByClassName('contact-content-table-editAndDeleteIcons')[0].style.display = "flex";
    }
}

/**
 * Schließt das Popup Fenster "contact-content-table-editAndDeleteIcons" durch ein Klick auf die Funktion.
 * In dem Fall, auf die dahinter liegende Fläche, welche dann dem Element ein Display "none" vergibt.
 * 
 * @function closePopupDiv
 * @returns {void} Gibt keinen Wert zurück.
 * 
 */
function closePopupDiv() {
    document.getElementsByClassName('contact-content-table-editAndDeleteIcons')[0].style.display = "none";
}

/**
 * Löscht einen Kontakt über die mobile Ansicht und aktualisiert die Kontaktliste.
 * 
 * Diese Funktion ruft die Löschlogik für einen Kontakt auf, kehrt danach zur Kontaktliste zurück
 * und rendert die aktualisierte Kontaktliste in der mobilen Ansicht.
 * 
 * @function deleteContactMobile
 * @param {number} userIndex Der Index des Kontakts in der Kontaktliste
 * @returns {Promise<void>} Ein Promise, welches die Kontakte löscht und 
 * die vorhandenen Kontakte neu reinläd.
 */
async function deleteContactMobile(userIndex) {
    await deleteContact(userIndex);
    goBackToContactList();
    await renderContactsInToContactList();
}

/**
 * Initialisierung indem die Seite geladen wird, wir beim laden vom Body neuladen.
 * @async
 * @function initContacts 
 * @returns {Promise<void>} Ein Promise, das den gesament Kontent rein rendert, 
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
 * @returns {Promise<void>} Ein Promise, das den gesament Kontent rein rendert.
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
            headLetterDiv[(index+1)].remove();
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
    bufferEdit = [];
}

/**
 * Fügt das Modal in "Conctact-Content" als erstes an und öffnet das Modal "Add Contact".
 * @function openAddContactModal
 * @returns {void} Gibt keinen Wert zurück.
 */
function openAddContactModal() {
    const CONTACT_CONTENT_REF = document.getElementsByClassName('content')[0];
    CONTACT_CONTENT_REF.innerHTML += modalAddContactTemplate();
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
    return {userIndex, USER_NAME, USER_EMAIL, USER_PHONE_NUMB}
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
      const {USER_NAME, USER_EMAIL} = await getUserInfos(userIndex);
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
    const {USER_NAME, USER_EMAIL, USER_PHONE_NUMB} = await getUserInfos(userIndex);
    CONTACT_CONTENT_TABLE.innerHTML = contactContentTableTemplate(userIndex, USER_NAME, USER_EMAIL, USER_PHONE_NUMB);
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
    return {inputfieldName, inputfieldEmail, inputfieldPhone}
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
    const {USER_NAME, USER_EMAIL, USER_PHONE_NUMB} = await getUserInfos(userIndex);
    CONTACT_CONTENT_REF.innerHTML += modalEditContactTemplate(userIndex, USER_NAME);
    const {inputfieldName, inputfieldEmail, inputfieldPhone} = getInputfieldContactModalInfos();
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
    const {inputfieldName, inputfieldEmail, inputfieldPhone} = getInputfieldContactModalInfos();
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
        await dataRef.set ({
            name: NAME,
            email: EMAIL,
            phone_number: PHONE_NUMB,
        })
        const CONTACT_CONTENT_TABLE = document.getElementById('contact-content-table');
        CONTACT_CONTENT_TABLE.innerHTML = contactContentTableTemplate(userIndex, NAME, EMAIL, PHONE_NUMB);
    } catch (error) {
    }
}

