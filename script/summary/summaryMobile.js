/**
 * Initialisiert die Firebase-Realtime-Datenbank.
 * @type {firebase.database.Database}
 */
const database = firebase.database();
/**
 * Überprüft, ob ein Benutzer in der Storage (z.B. LocalStorage oder SessionStorage) gespeichert ist,
 * und gibt diesen zurück, falls vorhanden.
 * @type {string | null} Der Benutzername des angemeldeten Benutzers oder `null`, wenn kein Benutzer gefunden wurde.
 */
const logedUser = sessionStorage.getItem('User');
/**
 * Referenz auf die `tasks`-Sammlung in der Firebase-Datenbank.
 * @type {firebase.database.Reference}
 */
const userBoardRef = database.ref(`tasks`);
/**
 * Das aktuelle Datum im ISO-Format (YYYY-MM-DD), abgeschnitten auf den Tageswert.
 * @type {string}
 */
const date = new Date().toISOString().split('T')[0];
/**
 * Das aktuelle Datum und die aktuelle Uhrzeit als Date-Objekt.
 * @type {Date}
 */
const currentDate = new Date();

/**
 * onload Funktion die fetchCurrentBoard ausführt
 */
function loadSummary() {
    fetchCurrentBoard();
}

/**
 * Diese Funktion fetched anhand der userBoardRef das aktuelle Task Board.
 * im weiteren wird deadline durch die Funktion getDueDates dafiniert.
 * danach wird countTasks mit den Parametern currentBoard und deadline ausgeführt.
 */
async function fetchCurrentBoard() {
    try {
        const UserBoard = await fetch(userBoardRef + '.json');
        const currentBoard = await UserBoard.json();
        let deadline = getDueDates(currentBoard);
        countTasks(currentBoard, deadline);
    } catch (error) {
        console.error("Fehler beim Laden der Daten von Firebase:", error);
    };
}

/**
 * 
 * @param {object} currentBoard Objekt das die aktuellen Tasks im Board enthält
 * @returns die funktion gibt die variable dueDate in die Funktion findNearestDate weiter
 * dueDate wird definiert indem das currentBoard Object zuerst "flach" gemacht wird ().values Methode)
 * und dann nach dem key dueDate gesucht wird.  Diese dueDates werden dann in der Variablen als Array 
 * gespeichert.
 */
function getDueDates(currentBoard) {
    const dueDates = Object.values(currentBoard).map((obj) => obj.dueDate);
    return findNearestDate(dueDates);
}

/**
 * 
 * @param {Array} dueDates 
 * @returns das Datum das am nächsten am jetzigen Datum liegt
 * Die Funktion findNearestDate sucht in einem Array von Datumswerten
 *  (dueDates) das Datum, das zeitlich am nächsten zum aktuellen Datum liegt.
 * Die reduce-Methode iteriert über das dueDates-Array und vergleicht jeweils zwei Werte: 
 * das aktuelle Datum (current) und das bisher am nächsten liegende Datum (closest).
 */
function findNearestDate(dueDates) {
    const currentTime = new Date(currentDate).getTime();
    const nearestDate = dueDates.reduce((closest, current) => {
        const currentDiff = Math.abs(new Date(current).getTime() - currentTime);
        const closestDiff = Math.abs(new Date(closest).getTime() - currentTime);
        return currentDiff < closestDiff ? current : closest;
    });

    return nearestDate;
}

/**
 * 
 * @param {object} currentBoard Objekt das die aktuellen Tasks im Board enthält
 * @param {date} deadline Datum der nächsten Deadline Task
 * die constante type wird definiert und zieht aus dem currentBoard Object per map Methode 
 * die Types der Task in ein Array.
 * die const urgency enthält ein Array aus allen Tasks die die Priorität Urgent haben per Filter Methode.
 * das Object counter wird erstellt, hier drin werden die 4 verschiedenen Board Status Typen aufgelistet
 * und zunächst auf 0 gesetzt. total, was die Anzahl der Tasks im Board enthält wird gleich über die länge 
 * des types Arrays definiert. Das selbe gilt für den Status Urgent der durch urgency.length festgelegt wird.
 * danach wird forLoopCount mit den parametern deadline types und counter ausgeführt. 
 */
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

/**
 * 
 * @param {object} counter Das counter Object enthält die gezählten Typen und den Urgency Status der Tasks
 * @param {Array} types Beinhaltet die verschiedenen Typen der Tasks (toDo, inprogress, Done..)
 * @param {date} deadline beinhaltet das Datumd er nächsten Deadline.
 * die for Schleife iteriert durch das types array und zählt die einzelnen Typen. Die Eerte werden dann im 
 * counter object hinterlegt. Die Variabeln deadline und counter wandern weiter in die formatDate Funktion.
 */
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

/**
 * 
 * @param {date} deadline beinhaltet das Datumd er nächsten Deadline.
 * @param {object} counter Das counter Object enthält die gezählten Typen und den Urgency Status der Tasks
 * in der const deadlineDate wird deadline in ein Date Objekt umgewandelt.
 * formatedDate formatiert deadlineDate dann per toLocalDateString Methode ins gewünschte Format.
 * counter und formatedDeadline werden nun in renderBoardSummary weitergegeben.
 */
function formatDate(deadline, counter) {
    const deadlineDate = new Date(deadline);
    let formatedDeadline = deadlineDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    renderBoardSummary(counter, formatedDeadline);
}

/**
 * 
 * @param {object} counter Das counter Object enthält die gezählten Typen und den Urgency Status der Tasks
 * @param {date} formatedDeadline Enthält das formatierte Date Object.
 * Das Counter Objekt wird in die verschiedenen Karten der Summary Übersicht gerendert. die formated Date kommt
 * in die deadline Box
 */
function renderBoardSummary(counter, formatedDeadline) {
    document.getElementById('toDoCounterSpan').innerHTML = counter.toDo;
    document.getElementById('doneCounterSpan').innerHTML = counter.done;
    document.getElementById('totalCount').innerHTML = counter.total;
    document.getElementById('awaitReview').innerHTML = counter.review;
    document.getElementById('urgentAmount').innerHTML = counter.urgent;
    document.getElementById('inProgress').innerHTML = counter.inProgress;
    document.getElementById('deadlineDate').innerHTML = formatedDeadline;
}
