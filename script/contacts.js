
const FIREBASE_URL = "https://console.firebase.google.com/project/joinda-1dd15/database/joinda-1dd15-default-rtdb/data/~2F";



// Get Data of Firebase
async function fetchData(path = "") {
    let response = await fetch(FIREBASE_URL + path);
    return (responseToJson = await response.json());
}