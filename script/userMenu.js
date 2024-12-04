let closeMenu;
const userMenu = document.getElementById('userMenu');

function openUserMenu() {
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
        }, 0);
    } else {
        userMenu.classList.add('dNone');
    };
}

function menuLegalBtn() {
    const currentUrl = window.location.href;
    if (currentUrl.includes("Mobile")) {
        window.location.href = "legal_noticeMobile.html";
    } else {
        window.location.href = "legal_notice.html";
    };
}

function menuPrivacyBtn() {
    const currentUrl = window.location.href;
    if (currentUrl.includes("Mobile")) {
        window.location.href = "privacy_policyMobile.html";
    } else {
        window.location.href = "privacy_policy.html";
    };
}

function logOutBtn() {
    const currentUrl = window.location.href;
    if (currentUrl.includes("Mobile")) {
        window.location.href = "loginMobile.html";
    } else {
        window.location.href = "login.html";
    };
    localStorage.removeItem('logedUser');
    sessionStorage.removeItem('logedUser');
}

function helpBtn() {
    const currentUrl = window.location.href;

    if (currentUrl.includes("Mobile")) {
        window.location.href = "helpMobile.html";
    } else {
        window.location.href = "help.html";
    };
}

function summaryBtn() {
    const currentUrl = window.location.href;
    if (currentUrl.includes("Mobile")) {
        window.location.href = "summaryMobile.html";
    } else {
        window.location.href = "summary.html";
    };
}

function addTaskBtn() {
    const currentUrl = window.location.href;
    if (currentUrl.includes("Mobile")) {
        window.location.href = "addTaskMobile.html";
    } else {
        window.location.href = "addTask.html";
    };
}

function boardBtn() {
    const currentUrl = window.location.href;
    if (currentUrl.includes("Mobile")) {
        window.location.href = "boardMobile.html";
    } else {
        window.location.href = "board.html";
    };
}

function contactsBtn() {
    const currentUrl = window.location.href;
    if (currentUrl.includes("Mobile")) {
        window.location.href = "contactsMobile.html";
    } else {
        window.location.href = "contacts.html";
    }; 
}