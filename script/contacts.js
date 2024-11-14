
//############################################################

//                FERTIGE FUNKTIONEN                        //

//############################################################

// Initialisierung Schritt
async function init() {
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




//############################################################

//                WORKING ON FUNKTIONEN                     //

//############################################################

async function getAllDetailsOfEachUser() {
    const OBJECT = await getFirebaseData(path = "/contacts");   // OBJECT MIT ALLEN USERN   
    const CONTACTS_BOARD_DIV = document.getElementById('contactInterface');
    for (let userIndex = 0; userIndex < await getContactsLength(); userIndex++) { // 8 noch ersetzten durch object länge
    
      const USER = Object.keys(OBJECT)[userIndex];   // iteriert durch die User in "Contacts"   
      const USER_NAME = (await getFirebaseData(`contacts/${USER}`)).name;
      const USER_EMAIL = (await getFirebaseData(`contacts/${USER}`)).email;
      const USER_PHONE_NUMB = (await getFirebaseData(`contacts/${USER}`)).phone_number; 
      checkFirstnameLetter(USER_NAME)
      contactBoardFirstLetterHeadTemplate(USER_NAME)
      CONTACTS_BOARD_DIV.innerHTML += contactBoradUserTemplate(USER_NAME, USER_EMAIL)
    }
}
  


// Gibt den Ersten Buchstaben des Vornamen aus
function checkFirstnameLetter(userName) {
    let firstLetterFirstname = userName;
    let getFirstLetter = firstLetterFirstname.split(" ")[0][0]   // Teilt den String in Wörter auf + nimmt das erste Wort + nimmt den ersten Buchstaben des ersten Worts
    return getFirstLetter;
}

// Überprüft übereinstimmenden Buchentaben des Vornamen
function checkIfFirstnameLetterMatching(userName) {

}





  
  
  
  //############################################################
  
  //                AUSGELAGERTE FUNKTIONEN                   //
  
  //############################################################
  
  
  // interagiert mit dem User Verzeichnis
  async function userInformations(user = "", data = "") {
                                                            
    let i = "Niclas";                                                   // hier eine schleife rein zur allg. Abfrage der kompletten Users
    const userName = await getUserInformations(user = i, data = "name");
    const userEmail = await getUserInformations(user = i, data = "email");
    const userPw = await getUserInformations(user = i, data = "password");
    const userPhoneNmb = await getUserInformations(user = i, data = "phonenumber")
    
    if (userPhoneNmb == null) { // nur zur fehler überbrückung :)
        const userPhoneNmb = "noch nicht da";
    
  
    console.log("Benutzername:",userName + " Email: " +userEmail + " Password: " +userPw + " Telefonnr.: " +userPhoneNmb);
    
    return {userName, userEmail, userPw, userPhoneNmb}
    }
  }

