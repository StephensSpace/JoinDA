/**
 * Firebase-Konfigurationsdetails.
 * 
 * Diese Konstante enthält die notwendigen Informationen zur Initialisierung der Verbindung
 * mit Firebase. Die Werte müssen mit den Projektdetails aus der Firebase-Konsole übereinstimmen.
 * 
 * @constant {Object} FIREBASE_CONFIG
 * @property {string} apiKey - Der API-Schlüssel des Firebase-Projekts, der für die Authentifizierung verwendet wird.
 * @property {string} authDomain - Die Authentifizierungs-Domain des Firebase-Projekts.
 * @property {string} databaseURL - Die URL der Firebase-Realtime-Datenbank.
 * @property {string} projectId - Die Projekt-ID des Firebase-Projekts.
 * @property {string} storageBucket - Der Storage-Bucket für Dateien in Firebase.
 * @property {string} messagingSenderId - Die Sender-ID für Firebase Cloud Messaging.
 * @property {string} appId - Die App-ID des Firebase-Projekts.
 */
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


