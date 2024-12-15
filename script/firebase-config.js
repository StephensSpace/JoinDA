
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
const DATABASE = firebase.database(APP);


