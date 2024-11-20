
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
    for (let userIndex = 0; userIndex < await getContactsLength(); userIndex++) { // 8 noch ersetzten durch object länge   
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

// Öffne das Edit-Contact Modal
async function openEditContactModal(userIndex) {
    const CONTACT_CONTENT_REF = document.getElementsByClassName('contact-content')[0]; 
    CONTACT_CONTENT_REF.innerHTML += modalEditContactTemplate(userIndex);
    const {USER_NAME, USER_EMAIL, USER_PHONE_NUMB} = await getUserInfos(userIndex);
    const inputfieldName = document.getElementById('inputName');
    const inputfieldEmail = document.getElementById('inputEmail');
    const inputfieldPhone = document.getElementById('inputPhone');
    const userImage = document.getElementsByClassName('modal-userImg')[0];
    inputfieldName.value = USER_NAME;
    inputfieldEmail.value = USER_EMAIL;
    inputfieldPhone.value = USER_PHONE_NUMB;
    userImage.innerHTML = document.getElementById(`userImage${userIndex}`).innerHTML;
}



// delete User Information
async function deleteContact(userIndex) {
    const OBJECT = await getFirebaseData(path = "/contacts");
    const USER = Object.keys(OBJECT)[userIndex];
    try {
        const dataRef = firebase.database().ref("/contacts/" + `${USER}`); // Erstelle eine Referenz zu den Daten
        await dataRef.remove(); // Lösche die Daten
        console.log("Daten erfolgreich gelöscht!");
    } catch (error) {
        console.error("Fehler beim Löschen:", error);
    }
    document.getElementById('contact-content-table').innerHTML = "";
    renderContactsInToContactList();
    closeModal();
}


// Add Contact 

async function addNewContact() {
    const NAME = document.getElementById('inputName').value;
    const EMAIL = document.getElementById('inputEmail').value;
    const PHONE_NUMB = document.getElementById('inputPhone').value;
    const dataRef = firebase.database().ref("/contacts/" + NAME); // Erstelle eine Referenz zu den Daten
    if (NAME == '' || EMAIL == '' || PHONE_NUMB == '') {
        window.alert('Bitte Kontakt Daten eingeben! :)')
    } else {
        try {
            await dataRef.set ({
                name: NAME,
                email: EMAIL,
                phone_number: PHONE_NUMB,
            })
            const userIndex = await getUserIndex(NAME);
            const CONTACT_CONTENT_TABLE = document.getElementById('contact-content-table');
            CONTACT_CONTENT_TABLE.innerHTML = contactContentTableTemplate(userIndex, NAME, EMAIL, PHONE_NUMB);
            console.log("Daten erfolgreich in Firebase gefetcht!");
        } catch (error) {
            console.error("Fehler beim Fetchen in Firebase:", error);
        }
        renderContactsInToContactList();
        closeModal();
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


// (await getUserIndex(7))[0] == "Niclas"

// (await getUserIndex(7))[0]



// Change Contact
    // NUR MIT NAMEN ALS PARAMETER UND ABFRAGE 
    //async function getUserInfoInContacts(USER) {
    //    const CONTACT_CONTENT_TABLE = document.getElementById('contact-content-table');
    //    const USER_NAME = (await getFirebaseData(`contacts/${USER}`)).name;
    //    const USER_EMAIL = (await getFirebaseData(`contacts/${USER}`)).email;
    //    const USER_PHONE_NUMB = (await getFirebaseData(`contacts/${USER}`)).phone_number; 
    //    CONTACT_CONTENT_TABLE.innerHTML = contactContentTableTemplate(USER_NAME, USER_EMAIL, USER_PHONE_NUMB);
    //}
}





// Fügt das Modal in "Conctact-Content" ein, legt sich jedoch durch Z-Index über alles andere!
function openAddcontactModal() {
    const CONTACT_CONTENT_REF = document.getElementsByClassName('contact-content')[0];
    CONTACT_CONTENT_REF.innerHTML += modalAddContactTemplate();
}

// Schließe das Modal für "Add new Contact" && "Edit Contact"!
function closeModal() {
    document.getElementsByTagName('modal')[0].remove();
}





//############################################################

//                AUSGELAGERTE FUNKTIONEN                   //

//############################################################


// NUR MIT NAMEN ALS PARAMETER UND ABFRAGE 
//async function renderContactInfosInContactsTable(USER) {
//    const CONTACT_CONTENT_TABLE = document.getElementById('contact-content-table');
//    const USER_NAME = (await getFirebaseData(`contacts/${USER}`)).name;
//    const USER_EMAIL = (await getFirebaseData(`contacts/${USER}`)).email;
//    const USER_PHONE_NUMB = (await getFirebaseData(`contacts/${USER}`)).phone_number; 
//    CONTACT_CONTENT_TABLE.innerHTML = contactContentTableTemplate(USER_NAME, USER_EMAIL, USER_PHONE_NUMB);
//}