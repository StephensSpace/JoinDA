function greetingAnimation() {
    const greetingBox = document.getElementById('greetingBox');
    greetingBox.addEventListener('animationend', () => {
        window.location.href = 'summaryMobile.html';
    });
}