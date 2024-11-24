const database = firebase.database();
const logedUser = sessionStorage.getItem('User');
const userBoardRef = database.ref(`User/${logedUser}/currentBoard`);
const currentDate = new Date();
const date = currentDate.toLocaleDateString('de-DE');

function setGreeting() {
    selectGreeting()
    setUsername()
}

function selectGreeting() {
    hour = currentDate.getHours();
    let greetingBox = document.getElementById('daytime');
    if(hour <= 11 || hour == 0){
        greetingBox.innerHTML = 'Good morning,'
    } if(hour >= 12 && hour < 18) {
        greetingBox.innerHTML = 'Good afternoon,'
    } else {
        greetingBox.innerHTML = "Good evening,"
    };
}

function setUsername() {
    document.getElementById('userName').innerHTML = logedUser
}
