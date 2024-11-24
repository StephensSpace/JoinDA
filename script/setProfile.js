const userRef = database.ref(`User/${logedUser}`);


function selectInitials() {
    if(logedUser.includes(" ")) {
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
}

selectInitials();