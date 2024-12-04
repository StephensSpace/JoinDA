const currentDate = new Date();
let logedUser = checkStorageForUser()

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
    setUsername();
}

function checkStorageForUser() {
    const user = sessionStorage.getItem('User') || localStorage.getItem('User');
    if (user) {
        return user;
    } else {
        window.location.href = "loginMobile.html";
    }
}
function setUsername() {
    document.getElementById('userName').innerHTML = logedUser
    greetingAnimation()
}

function greetingAnimation() {
    const greetingBox = document.getElementById('greetingBox');
    greetingBox.addEventListener('animationend', () => {
        window.location.href = 'summaryMobile.html';
    });
}