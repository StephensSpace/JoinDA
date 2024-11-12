
// Firebase-Konfiguration
const FIREBASE_CONFIG = {
    apiKey: "AIzaSyCeDJLaxR5LOFSo6e48oPoNUDZTed8KTl0",
    authDomain: "joinda-1dd15.firebaseapp.com",
    databaseURL: "https://joinda-1dd15-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "joinda-1dd15",
    storageBucket: "joinda-1dd15.firebasestorage.app",
    messagingSenderId: "5299972773",
    appId: "1:5299972773:web:708a815a6ad5a2e8a27b4c"
};

// Firebase initialisieren
const APP = firebase.initializeApp(FIREBASE_CONFIG);
const DATABASE = firebase.database();


//############################################################

//                FERTIGE FUNKTIONEN                        //

//############################################################








//############################################################

//                WORKING ON FUNKTIONEN                     //

//############################################################

async function getFirebaseData(path = "/") {
  const SNAPSHOT = await firebase.database().ref(path).once('value');   //   .ref("\User/Niclas")
  const RESULT = SNAPSHOT.val(); // Ergebnis als Object
  return RESULT;
}

async function getContactsLength() {
  const ALL_CONTACTS = (await getFirebaseData(`contacts/`));   
  const LENGTH_OF_ALL_CONTACTS = Object.keys(ALL_CONTACTS).length;
  return LENGTH_OF_ALL_CONTACTS;
}

async function getAllDetailsOfEachUser() {
  const OBJECT = await getFirebaseData(path = "/contacts");   // OBJECT MIT ALLEN USERN

  for (let userIndex = 0; userIndex <= await getContactsLength(); userIndex++) { // 8 noch ersetzten durch object länge
    
    const USER = Object.keys(OBJECT)[userIndex];   // iteriert durch die User in "Contacts"

    const USER_NAME = (await getFirebaseData(`contacts/${USER}`)).name;
    const USER_EMAIL = (await getFirebaseData(`contacts/${USER}`)).email;
    const USER_PHONE_NUMB = (await getFirebaseData(`contacts/${USER}`)).phone_number;


    return {USER_NAME, USER_EMAIL, USER_PHONE_NUMB}
  }

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