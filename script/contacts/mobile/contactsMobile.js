
// Globale Variabeln
const logedUser = sessionStorage.getItem('User'); // für Stephen 

// Für Mobile 

// Fügt neuen Kontakt hinzu, blendet "Contact Successfully Created!" ein && blendet Contactliste aus und den Contact Table ein!
async function addNewContactMobile() {
    document.getElementsByClassName('add-new-contact-background')[0].style.display = "none";
    document.getElementsByClassName('contact-board')[0].style.display = "none";
    document.getElementsByClassName('edit-delete-btn-background')[0].style.display = "unset";
    document.getElementsByClassName('contact-content')[0].style.display = "flex";
    await addNewContact ();
    contactSuccessfullyCreated();
}

// Funktion zum Rein & wieder rausnehmen der Div mit "Contact Successfully Created!"
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

// Zum zurück kommen vom Contact Table zur Contact List
function goBackToContactList() {
    document.getElementsByClassName('contact-board')[0].style.display = "unset"; // zeige wieder die Kontaktliste an
    document.getElementById('contact-content-table').innerHTML = ""; // leere den Contact Informations Bereich
    document.getElementsByClassName('edit-delete-btn-background')[0].style.display = "none"; // entfern den edit und delete button in der Kontaktlisten Ansicht
    document.getElementsByClassName('contact-content')[0].style.display = "none"; // Entfernt das Kontakt Details Template von der HTML 
    document.getElementsByClassName('add-new-contact-background')[0].style.display = "unset"; // fügt button "add new contact" hinzu 
}

// Funktion zum rendern der User Details ins Contact Content Table
async function renderContactInfosInContactsTableMobile(index) {
    document.getElementsByClassName('contact-board')[0].style.display = "none"; //document.getElementsByClassName('contact-content')[0].style.display = "flex";
    document.getElementsByClassName('contact-content')[0].style.display = "flex"; //  fügt Kontaktinformation Template + button edit contact hinzu 
    document.getElementsByClassName('edit-delete-btn-background')[0].style.display = "unset"; // mache sichtbar den edit und delete button in der Kontaktlisten Ansicht
    await renderContactInfosInContactsTable(index); // Get Contact information into "contact-content-table"
    document.getElementsByClassName('add-new-contact-background')[0].style.display = "none"; // entfernt den add new contact button in der Kontakt Details Ansicht
}

// openup Popup-Div 
function openPopupDiv() {
    if (document.getElementById('popupDiv') == null) {        // Wenn Popup doc... = true; also wenn er da ist, dann else
        document.getElementsByClassName('contact-content-table-editAndDeleteIcons')[0].style.display = "flex";
    }
}

// closing Popup-Div through click on the background
function closePopupDiv() {
    document.getElementsByClassName('contact-content-table-editAndDeleteIcons')[0].style.display = "none";
}

// Delete Button in Menu bei Contact Information
function deleteContactMobile(userIndex) {
    deleteContact(userIndex);
    goBackToContactList();
    renderContactsInToContactList();
}

// Allg. Funktionen Mobile angepasst

// Color Template für un- und definierte User
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
    const CONTACT_CONTENT_REF = document.getElementsByClassName('content')[0];
    CONTACT_CONTENT_REF.innerHTML += modalAddContactTemplate();
}

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
    addMarginOnLastUser();                                
}
  
// Funktion zum rein rendern der Information zu jedem Kontakt ins Contacts - Board
async function renderContactInfosInContactsTable(userIndex) {
    const OBJECT = await getFirebaseData(path = "/contacts");
    clickedUser();
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
    const CONTACT_CONTENT_REF = document.getElementsByClassName('content')[0]; 
    const {USER_NAME, USER_EMAIL, USER_PHONE_NUMB} = await getUserInfos(userIndex);
    CONTACT_CONTENT_REF.innerHTML += modalEditContactTemplate(userIndex, USER_NAME);
    const {inputfieldName, inputfieldEmail, inputfieldPhone} = getInputfieldContactModalInfos();
    inputfieldName.value = USER_NAME;
    inputfieldEmail.value = USER_EMAIL;
    inputfieldPhone.value = USER_PHONE_NUMB;
}
// Change Contact Information
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
// auslagerung 
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
function addNewContactIfElse(NAME, EMAIL, PHONE_NUMB, dataRef) {
    if (NAME == '' || EMAIL == '' || PHONE_NUMB == '') {
        window.alert('Bitte Kontakt Daten eingeben!')
    } else {
        addNewContactTryCatch(NAME, EMAIL, PHONE_NUMB, dataRef);
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

// Auslagerung try catch
async function addNewContactTryCatch(NAME, EMAIL, PHONE_NUMB, dataRef) {
    try {
        await dataRef.set ({
            name: NAME,
            email: EMAIL,
            phone_number: PHONE_NUMB,
        })
        const userIndex = await getUserIndex(NAME); // get userIndex of Firebase 
        await renderContactTableTemplate(userIndex, NAME, EMAIL, PHONE_NUMB); // rendert User Information in Content-Table 
        console.log("Kontakt erfolgreich in Firebase angelegt!");
    } catch (error) {
        console.error("Fehler beim anlegen eines neuen Kontaktes in Firebase:", error);
    }
}

// Abfrage wann "user-contact" fertig geladen ist um userIconTemplateContactTable die Color durchzugeben
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

// für definierte User
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

// für undefinierte User
function getRandomeColor(color) {
    let colorOftheAboveIcon = color;
    let randomIndex = Math.floor((Math.random() * 7)); // Wenn kein passendes Element in der Schleife gefunden wurde
    let getRandomColor = Object.entries(BACKGROUND_COLORS_LETTERS.undefined)[randomIndex][1];
    if (colorOftheAboveIcon == getRandomColor) {
        getRandomeColor(color);
    } 
    return getRandomColor;
}

// konverter für rgb in hexadezimal 
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

// last user has no padding at bottom so added
function addMarginOnLastUser() {
    let lengthOfCurrentUsersInList = document.getElementsByClassName("user-contact").length;
    let lastUserInList = document.getElementsByClassName("user-contact")[(lengthOfCurrentUsersInList - 1)];
    lastUserInList.style.marginBottom = ("20px");
}






//############################################################

//                WORKING ON FUNKTIONEN                     //

//############################################################


// für den gerade angewählten User zum einblenden dessen Informationen
function clickedUser() {
    const contacts = document.getElementsByClassName('user-contact');
  
    Array.from(contacts).forEach((contact) => {
      contact.addEventListener('click', () => {
        Array.from(contacts).forEach((item) => {
          item.classList.remove('clicked-Background'); 
        });
  
        contact.classList.toggle('clicked-Background');
      });
    });
  }

