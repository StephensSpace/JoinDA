const database = firebase.database();
const logedUser = sessionStorage.getItem('User');
const userBoardRef = database.ref(`User/${logedUser}/currentBoard`);
const currentDate = new Date();
const date = currentDate.toLocaleDateString('de-DE');

function setGreeting() {
    selectGreeting();
    setUsername();
    fetchCurrentBoard();
}

function selectGreeting() {
    hour = currentDate.getHours();
    let greetingBox = document.getElementById('daytime');
    if(hour <= 11 || hour == 0){
        greetingBox.innerHTML = 'Good morning,';
    } if(hour >= 12 && hour < 18) {
        greetingBox.innerHTML = 'Good afternoon,';
    } else {
        greetingBox.innerHTML = "Good evening,";
    };
}

function setUsername() {
    document.getElementById('userName').innerHTML = logedUser
}

async function fireOrSessionStorage() {
    let counterValues = sessionStorage.getItem("Counter");
    if (counterValues) {
        counterValues = JSON.parse(counterValues);
    } else {
        counterValues = await fetchCurrentBoard();
    }
    renderBoardSummary(currentBoard);
}

async function fetchCurrentBoard() {
    try {
        const UserBoard = await fetch(userBoardRef + '.json');
        const currentBoard = await UserBoard.json();
        setBoardToStorage(currentBoard);
        return currentBoard.Counter 
    } catch (error) {
        console.error("Fehler beim Laden der Daten von Firebase:", error);
    }
}

function setBoardToStorage(currentBoard) {
    sessionStorage.setItem("Tasks", JSON.stringify(currentBoard.tasks));
    sessionStorage.setItem("Counter", JSON.stringify(currentBoard.counter));
}

function renderBoardSummary(currentBoard) {
    let toDo = currentBoard.counter.toDo;
    let done = currentBoard.counter.Done;
    let review = currentBoard.counter.Review;
    let total = currentBoard.counter.Total;
    let urgent = currentBoard.counter.Urgent;
    let inProgress = currentBoard.counter.inProgress;
    document.getElementById('toDoCounterSpan').innerHTML = `${toDo}`;
    document.getElementById('doneCounterSpan').innerHTML =  `${done}`;
    document.getElementById('totalCount').innerHTML = `${total}`;
    document.getElementById('awaitReview').innerHTML = `${review}`;
    document.getElementById('urgentAmount').innerHTML = `${urgent}`;
    document.getElementById('inProgress').innerHTML = `${inProgress}`;
}