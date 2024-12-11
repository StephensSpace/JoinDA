const database = firebase.database();
let logedUser = checkStorageForUser();
const userBoardRef = database.ref(`tasks`);
const date = new Date().toISOString().split('T')[0];
const currentDate = new Date();

function setGreeting() {
    selectGreeting();
    setUsername();
    fetchCurrentBoard();
}

function selectGreeting() {
    hour = currentDate.getHours();
    let greetingBox = document.getElementById('daytime');
    if (hour < 12) {  // Good morning
        greetingBox.innerHTML = 'Good morning,';
    } else if (hour >= 12 && hour < 18) {  // Good afternoon
        greetingBox.innerHTML = 'Good afternoon,';
    } else {  // Good evening
        greetingBox.innerHTML = "Good evening,";
    };
}

function checkStorageForUser() {
    const user = sessionStorage.getItem('User') || localStorage.getItem('User');
    if (user) {
        return user;
    } else {
        window.location.href = "login.html";
    }
}

function setUsername() {
    document.getElementById('userName').innerHTML = logedUser
}

async function fetchCurrentBoard() {
    try {
        const UserBoard = await fetch(userBoardRef + '.json');
        const currentBoard = await UserBoard.json();
        let deadline = getDueDates(currentBoard);
        countTasks(currentBoard, deadline);
    } catch (error) {
        console.error("Fehler beim Laden der Daten von Firebase:", error);
    }
}

function getDueDates(currentBoard) {
    const dueDates = Object.values(currentBoard).map((obj) => obj.dueDate);
    return findNearestDate(dueDates)
}

function findNearestDate(dueDates) {
    const currentTime = new Date(currentDate).getTime();
    const nearestDate = dueDates.reduce((closest, current) => {
        const currentDiff = Math.abs(new Date(current).getTime() - currentTime);
        const closestDiff = Math.abs(new Date(closest).getTime() - currentTime);
        return currentDiff < closestDiff ? current : closest;
    });

    return nearestDate;
}

function countTasks(currentBoard, deadline) {
    const types = Object.values(currentBoard).map((obj) => obj.type);
    const urgency = Object.values(currentBoard).filter((obj) => obj.priority === "Urgent");
    const counter = {
        toDo: 0,
        done: 0,
        review: 0,
        urgent: urgency.length,
        inProgress: 0,
        total: types.length
    };

    forLoopCount(counter, types, deadline);
}

function forLoopCount(counter, types, deadline) {
    for (let index = 0; index < types.length; index++) {
        const type = types[index];
        if (type === "todo") {
            counter.toDo++;
        } else if (type === "done") {
            counter.done++;
        } else if (type === "await-feedback") {
            counter.review++;
        } else if (type === "in-progress") {
            counter.inProgress++
        }   }
    formatDate(deadline, counter)
}

function formatDate(deadline, counter) {
    const deadlineDate = new Date(deadline);
    let formatedDeadline = deadlineDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    renderBoardSummary(counter, formatedDeadline)
  }

function renderBoardSummary(counter, formatedDeadline) {
    document.getElementById('toDoCounterSpan').innerHTML = counter.toDo;
    document.getElementById('doneCounterSpan').innerHTML = counter.done;
    document.getElementById('totalCount').innerHTML = counter.total;
    document.getElementById('awaitReview').innerHTML = counter.review;
    document.getElementById('urgentAmount').innerHTML = counter.urgent;
    document.getElementById('inProgress').innerHTML = counter.inProgress;
    document.getElementById('deadlineDate').innerHTML = formatedDeadline;
}
