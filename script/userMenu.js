let closeMenu;
const userMenu = document.getElementById('userMenu');

function openUserMenu() {
    if (userMenu.classList.contains('dNone')) {
        userMenu.classList.remove('dNone'); 
        const closeMenu = function (event) {
            if (!userMenu.contains(event.target)) {
                userMenu.classList.add('dNone'); // Overlay schließen
                document.removeEventListener('click', closeMenu); // Listener entfernen
            }};
        setTimeout(() => {
            document.addEventListener('click', closeMenu);
        }, 0);
    } else {
        userMenu.classList.add('dNone');
    }
}

function menuLegalBtn() {
    window.location.href = "legal_notice.html";
}

function menuPrivacyBtn() {
    window.location.href = "privacy_policy.html";
}

function logOutBtn() {
    window.location.href = "login.html";
    localStorage.removeItem('logedUser');
    sessionStorage.removeItem('logedUser');
}

function helpBtn() {
    window.location.href = "help.html";
}