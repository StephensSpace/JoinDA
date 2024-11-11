// Firebase-Konfiguration
const firebaseConfig = {
    apiKey: "AIzaSyCeDJLaxR5LOFSo6e48oPoNUDZTed8KTl0",
    authDomain: "joinda-1dd15.firebaseapp.com",
    databaseURL: "https://joinda-1dd15-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "joinda-1dd15",
    storageBucket: "joinda-1dd15.firebasestorage.app",
    messagingSenderId: "5299972773",
    appId: "1:5299972773:web:708a815a6ad5a2e8a27b4c"
};

// Firebase initialisieren
const app = firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// zieht alle Informationen aus dem "/" Haupt-Verzeichnis 
function getWholeApiInformations() {
    return firebase.database().ref('/').once('value')   // nur ein "/" um im Hauptordner zusein "User/" führt uns in den Unterordner "User"
            .then((snapshot) => {
           return snapshot.val();
});
}

// zieht alle Informationen aus dem "User" Verzeichnis
function getUserInformations(user = "", data = "") {
    return firebase.database().ref('User/' + `${user}/` + data).once('value')   // nur ein "/" um im Hauptordner zusein "User/" führt uns in den Unterordner "User"
            .then((snapshot) => {
           return snapshot.val();
});
}


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




async function wholeApiInformations(params) {
    
}

async function getAllUsers() {
    const snapshot = await firebase.database().ref('users').once('value');
    const users = snapshot.val();
    
    for (let username in users) {
      if (users.hasOwnProperty(username)) {
        const user = users[username];
        console.log("Benutzer:", username);
        console.log("E-Mail:", user.email);
        console.log("Benutzername:", user.benutzername);
        console.log("Passwort:", user.password);
        console.log("------------------");
      }
    }
  }