
//############################################################

//                FERTIGE FUNKTIONEN                        //

//############################################################

// Initialisierung Schritt
async function initContacts() {
    await renderAll();
}

// Rendere alle Funktionen 
async function renderAll() {
    await renderContactsInToContactList();
}

// bekomme die allg. Daten aus der Firebase
async function getFirebaseData(path = "/") {
    const SNAPSHOT = await firebase.database().ref(path).once('value');
    const RESULT = SNAPSHOT.val(); // Ergebnis als Object
    return RESULT;
}

// bekomme die Länge der Momentanen Kontakte im Verzeichnis "contacts/"
async function getContactsLength() {
    const ALL_CONTACTS = (await getFirebaseData(`contacts/`));   
    const LENGTH_OF_ALL_CONTACTS = Object.keys(ALL_CONTACTS).length;
    return LENGTH_OF_ALL_CONTACTS;
}

// Überprüft übereinstimmenden Buchentaben im "headLetter" & Entferne "headLetterDiv" bei gleichen Buchstaben
function checkHeadLetter() {
    for (let index = 0; index < headLetter.length; index++) {
        let x = headLetter[(index)].innerHTML;
        let y = headLetter[(index + 1)]?.innerHTML;
        if (x == y) {
            headLetterDiv[(index+1)].remove();
        }
    }
}

// Gibt den Ersten Buchstaben des Vornamen aus
function getFirstnameLetter(USER_NAME) {
    let firstLetterFirstname = USER_NAME;
    let getFirstLetter = firstLetterFirstname.split(" ")[0][0]   // Teilt den String in Wörter auf + nimmt das erste Wort + nimmt den ersten Buchstaben des ersten Worts
    return getFirstLetter;
}

// stopping event bubbling (clicks trough)
function eventBubbling(event) {
    event.stopPropagation();
}

// Schließe das Modal für "Add new Contact" && "Edit Contact"!
function closeModal() {
    document.getElementsByTagName('modal')[0]?.remove();
}

// Fügt das Modal in "Conctact-Content" ein, legt sich jedoch durch Z-Index über alles andere!
function openAddContactModal() {
    const CONTACT_CONTENT_REF = document.getElementsByClassName('contact-content')[0];
    CONTACT_CONTENT_REF.innerHTML += modalAddContactTemplate();
}


//############################################################

//                WORKING ON FUNKTIONEN                     //

//############################################################

// Returns the User Information of each User
async function getUserInfos(userIndex) {
    const OBJECT = await getFirebaseData(path = "/contacts");
    const USER = Object.keys(OBJECT)[userIndex];
    const USER_NAME = (await getFirebaseData(`contacts/${USER}`)).name;
    const USER_EMAIL = (await getFirebaseData(`contacts/${USER}`)).email;
    const USER_PHONE_NUMB = (await getFirebaseData(`contacts/${USER}`)).phone_number; 
    return {userIndex, USER_NAME, USER_EMAIL, USER_PHONE_NUMB}
}

// Funktion zum rein rendern der Kontakte ins Kontakt übersicht Board
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
}
  
// Funktion zum rein rendern der Information zu jedem Kontakt ins Contacts - Board
async function renderContactInfosInContactsTable(userIndex) {
    const OBJECT = await getFirebaseData(path = "/contacts");
    const USER = Object.keys(OBJECT)[userIndex];
    const CONTACT_CONTENT_TABLE = document.getElementById('contact-content-table');
    const {USER_NAME, USER_EMAIL, USER_PHONE_NUMB} = await getUserInfos(userIndex);
    CONTACT_CONTENT_TABLE.innerHTML = contactContentTableTemplate(userIndex, USER_NAME, USER_EMAIL, USER_PHONE_NUMB);
}

// auslagerung von dem input im edit & contact modal
function getInputfieldContactModalInfos() {
    const inputfieldName = document.getElementById('inputName');
    const inputfieldEmail = document.getElementById('inputEmail');
    const inputfieldPhone = document.getElementById('inputPhone');
    return {inputfieldName, inputfieldEmail, inputfieldPhone}
}

// Öffne das Edit-Contact Modal
async function openEditContactModal(userIndex) {
    const CONTACT_CONTENT_REF = document.getElementsByClassName('contact-content')[0]; 
    CONTACT_CONTENT_REF.innerHTML += modalEditContactTemplate(userIndex);
    const {USER_NAME, USER_EMAIL, USER_PHONE_NUMB} = await getUserInfos(userIndex);
    const {inputfieldName, inputfieldEmail, inputfieldPhone} = getInputfieldContactModalInfos();
    const userImage = document.getElementsByClassName('modal-userImg')[0];
    inputfieldName.value = USER_NAME;
    inputfieldEmail.value = USER_EMAIL;
    inputfieldPhone.value = USER_PHONE_NUMB;
    userImage.innerHTML = document.getElementById(`userImage${userIndex}`).innerHTML;

}
// Change Contact Information
async function editContactInModal(userIndex) {
    const {inputfieldName, inputfieldEmail, inputfieldPhone} = getInputfieldContactModalInfos();
    const OBJECT = await getFirebaseData(path = "/contacts");
    const USER = Object.keys(OBJECT)[userIndex];
    const dataRef = firebase.database().ref("/contacts/" + `${USER}`);
    editContactInModalTryCatch(userIndex, inputfieldName, inputfieldEmail, inputfieldPhone, dataRef);
    closeModal();
    renderContactsInToContactList();
    renderContactInfosInContactsTable(userIndex);
}

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
        console.log("Kontakt erfolgreich in Firebase geändert!");
    } catch (error) {
        console.error("Fehler beim ändern des Kontakts in Firebase:", error);
    }
}

// delete User Information
async function deleteContact(userIndex) {
    const OBJECT = await getFirebaseData(path = "/contacts");
    const USER = Object.keys(OBJECT)[userIndex];
    try {
        const dataRef = firebase.database().ref("/contacts/" + `${USER}`); // Erstelle eine Referenz zu den Daten
        await dataRef.remove(); // Lösche die Daten
        console.log("Kontakt erfolgreich gelöscht!");
    } catch (error) {
        console.error("Fehler beim Löschen des Kontaktes:", error);
    }
    document.getElementById('contact-content-table').innerHTML = "";
    renderContactsInToContactList();
    closeModal();
}


// Add Contact 
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
// Auslagerung if/ else | check if input not empty
async function addNewContactIfElse(NAME, EMAIL, PHONE_NUMB, dataRef) {
    if (NAME == '' || EMAIL == '' || PHONE_NUMB == '') {
        window.alert('Bitte Kontakt Daten eingeben! :)')
    } else {
        addNewContactTryCatch(NAME, EMAIL, PHONE_NUMB, dataRef);
        renderContactsInToContactList();
        closeModal();
    }
}
// Auslagerung try catch
async function addNewContactTryCatch(NAME, EMAIL, PHONE_NUMB, dataRef) {
    try {
        await dataRef.set ({
            name: NAME,
            email: EMAIL,
            phone_number: PHONE_NUMB,
        })
        const userIndex = await getUserIndex(NAME); // get userIndex of Firebase 
        const CONTACT_CONTENT_TABLE = document.getElementById('contact-content-table');
        CONTACT_CONTENT_TABLE.innerHTML = contactContentTableTemplate(userIndex, NAME, EMAIL, PHONE_NUMB);
        console.log("Kontakt erfolgreich in Firebase angelegt!");
    } catch (error) {
        console.error("Fehler beim anlegen eines neuen Kontaktes in Firebase:", error);
    }
}


// get position (userIndex) of user in contacts
async function getUserIndex(NAME) {
    const OBJECT = await getFirebaseData(path = "/contacts");
    for (let i = 0; i < await getContactsLength(); i++) {
        const USER = Object.entries(OBJECT)[i][0];
        if (USER == NAME) {
            return i;
        } 
    }
}






//############################################################

//                AUSGELAGERTE FUNKTIONEN                   //

//############################################################


