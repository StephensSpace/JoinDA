function checkViewport() {
    // Wenn die Viewport-Breite <= 450px, leite zur mobilen Version weiter
    if (window.innerWidth <= 660) {
        // Prüfe, ob die mobile Version noch nicht geladen wurde
        if (!window.location.href.includes('loginMobile.html')) {
            window.location.href = "loginMobile.html";
        }
    } else {
        // Wenn die Viewport-Breite > 450px, leite zur Desktop-Version weiter
        if (!window.location.href.includes('login.html')) {
            window.location.href = "login.html";
        }
    }
}

// Event Listener für resize-Ereignis
window.addEventListener('resize', checkViewport);

// Direkt beim Laden der Seite die Viewport-Größe überprüfen
checkViewport();