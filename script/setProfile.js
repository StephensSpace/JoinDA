
function checkLogedUser() {
    if (typeof window.logedUser === "undefined" || logedUser === null) {
        window.logedUser = checkStorageForUser(); // logedUser nur definieren, wenn sie nicht existiert
        selectInitials();
    } else {
        selectInitials();
    }
}

function checkStorageForUser() {
    const user = sessionStorage.getItem('User') || localStorage.getItem('User');
    if (user) {
        return user;
    } else {
        window.location.href = "login.html";
    }
}

function selectInitials() {
    if (logedUser.includes(" ")) {
        const words = logedUser.split(" ");
        const initials = words[0][0].toUpperCase() + words[1][0].toUpperCase();
        setUserIcon(initials);
    } else {
        const initials = logedUser[0].toUpperCase() + logedUser[1].toUpperCase()
        setUserIcon(initials);
    }
}

function setUserIcon(initials) {
    document.getElementById('initials').innerHTML = `${initials}`;
    colorPicker(initials);
}

function colorPicker(initials) {
    if (initials[0] == "A" || "B" || "C") {
        document.getElementById('userProfil').style.background = "#FF7A00"
    } else if (initials[0] == "D" || "E" || "F") {
        document.getElementById('userProfil').style.background = "#9327FF"
    } else if (initials[0] == "G" || "H" || "I") {
        document.getElementById('userProfil').style.background = "#6E52FF"
    } else if (initials[0] == "J" || "K" || "L") {
        document.getElementById('userProfil').style.background = "#FC71FF"
    } else if (initials[0] == "M" || "N" || "O") {
        document.getElementById('userProfil').style.background = "#FFBB2B"
    } else if (initials[0] == "P" || "Q" || "R") {
        document.getElementById('userProfil').style.background = "#1FD7C1"
    } else { document.getElementById('userProfil').style.background = "#462F8A" }
}

checkLogedUser();