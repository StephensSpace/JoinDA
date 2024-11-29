function checkViewport() {
    const currentPage = window.location.pathname.split('/').pop();
    const isMobilePage = currentPage.includes('Mobile.html');
    const mobilePage = isMobilePage ? currentPage : currentPage.replace('.html', 'Mobile.html');
    const desktopPage = isMobilePage ? currentPage.replace('Mobile.html', '.html') : currentPage;
    if (window.innerWidth <= 660) {
        if (!window.location.href.includes(mobilePage)) {
            window.location.href = mobilePage;
        }
    } else {
        if (!window.location.href.includes(desktopPage)) {
            window.location.href = desktopPage;
        }
    }
}

// Event Listener für resize-Ereignis
window.addEventListener('resize', checkViewport);

// Direkt beim Laden der Seite die Viewport-Größe überprüfen
checkViewport();