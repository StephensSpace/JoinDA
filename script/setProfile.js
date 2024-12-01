function checkLogedUser() {
    if (!logedUser || logedUser === "NaN" || logedUser.trim() === "") {
        window.location.href = "login.html";
    } else {
        selectInitials();
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


function openUserMenu() {
    const userMenu = document.getElementById('userMenu');
    if (userMenu.classList.contains('dNone')) {
        userMenu.classList.remove('dNone'); 
        const closeMenu = function (event) {
            if (!userMenu.contains(event.target)) {
                userMenu.classList.add('dNone'); // Overlay schließen
                document.removeEventListener('click', closeMenu); // Listener entfernen
            }
        };
        setTimeout(() => {
            document.addEventListener('click', closeMenu);
        }, 0); // Verzögerung, um den initialen Klick zu ignorieren
    } else {
        userMenu.classList.add('dNone'); // Overlay schließen
    }
}


checkLogedUser();