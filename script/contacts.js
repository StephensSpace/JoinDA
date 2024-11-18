
//############################################################

//                FERTIGE FUNKTIONEN                        //

//############################################################

// Initialisierung Schritt
async function initContacts() {
    await renderAll();
}

// Rendere alle Funktionen 
async function renderAll() {
    await getAllDetailsOfEachUser();
}

// bekomme die allg. Daten aus der Firebase
async function getFirebaseData(path = "/") {
    const SNAPSHOT = await firebase.database().ref(path).once('value');   //   .ref("\User/Niclas")
    const RESULT = SNAPSHOT.val(); // Ergebnis als Object
    return RESULT;
}

// bekomme die Länge der Momentanen Kontakte im Verzeichnis "contacts/"
async function getContactsLength() {
    const ALL_CONTACTS = (await getFirebaseData(`contacts/`));   
    const LENGTH_OF_ALL_CONTACTS = Object.keys(ALL_CONTACTS).length;
    return LENGTH_OF_ALL_CONTACTS;
}

// Überprüft übereinstimmenden Buchentaben im "headLetter" & Entferne "headLetterDiv" bei Gleichheit
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




//############################################################

//                WORKING ON FUNKTIONEN                     //

//############################################################

//
async function getAllDetailsOfEachUser() {
    const OBJECT = await getFirebaseData(path = "/contacts");   // OBJECT MIT ALLEN USERN   
    const CONTACTS_BOARD_DIV = document.getElementById('contactInterface');
    for (let userIndex = 0; userIndex < await getContactsLength(); userIndex++) { // 8 noch ersetzten durch object länge
      const USER = Object.keys(OBJECT)[userIndex];   // iteriert durch die User in "Contacts"   
      const USER_NAME = (await getFirebaseData(`contacts/${USER}`)).name;
      const USER_EMAIL = (await getFirebaseData(`contacts/${USER}`)).email;
      const USER_PHONE_NUMB = (await getFirebaseData(`contacts/${USER}`)).phone_number; 
      getFirstnameLetter(USER_NAME);                    // Übergebe User Namen
      contactBoardFirstLetterHeadTemplate(USER_NAME);   // Übergebe User Namen
      CONTACTS_BOARD_DIV.innerHTML += contactBoradUserTemplate(USER_NAME, USER_EMAIL, userIndex)
      checkHeadLetter();                                // führe Funktion aus
    }
}
  
//
async function getUserInfoInContacts(userIndex) {
    const OBJECT = await getFirebaseData(path = "/contacts");
    const USER = Object.keys(OBJECT)[userIndex];
    
    const CONTACT_CONTENT_TABLE = document.getElementById('contact-content-table');
    const USER_NAME = (await getFirebaseData(`contacts/${USER}`)).name;
    const USER_EMAIL = (await getFirebaseData(`contacts/${USER}`)).email;
    const USER_PHONE_NUMB = (await getFirebaseData(`contacts/${USER}`)).phone_number; 
    
    CONTACT_CONTENT_TABLE.innerHTML = contactContentTableTemplate(userIndex, USER_NAME, USER_EMAIL, USER_PHONE_NUMB);
    // NUR MIT NAMEN ALS PARAMETER UND ABFRAGE 
    //async function getUserInfoInContacts(USER) {
    //    const CONTACT_CONTENT_TABLE = document.getElementById('contact-content-table');
    //    const USER_NAME = (await getFirebaseData(`contacts/${USER}`)).name;
    //    const USER_EMAIL = (await getFirebaseData(`contacts/${USER}`)).email;
    //    const USER_PHONE_NUMB = (await getFirebaseData(`contacts/${USER}`)).phone_number; 
    //    CONTACT_CONTENT_TABLE.innerHTML = contactContentTableTemplate(USER_NAME, USER_EMAIL, USER_PHONE_NUMB);
    //}
}






async function addContact() {
    const CONTACT_CONTENT_REF = document.getElementsByClassName('contact-content')[0];
    CONTACT_CONTENT_REF.innerHTML += modalAddContactTemplate();
}








//############################################################

//                AUSGELAGERTE FUNKTIONEN                   //

//############################################################


// close the dialog overlay with an click into nothing
function closeDialogOverlay() {
    document.getElementById('dialogBackground').remove();
}

// stopping event bubbling (clicks trough)
function eventBubbling(event) {
    event.stopPropagation();
}

