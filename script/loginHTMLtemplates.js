function loginForm() {
    return `<h1>Log in</h1>
        <div class="vector"></div>
        <form onsubmit="login(); return false" method="post">
            <div class="lockWrapper">
                <input type="email" placeholder="Email" id="email" required>
                <img src="./assets/icons/Login/mail.svg" alt="" class="mail">
            </div>
            <div class="lockWrapper">
                <input type="password" placeholder="Password" id="password" required>
                <img src="./assets/icons/Login/lock.svg" alt="" class="lock">
            </div>
            <message id="msgBox" class="dNone">Username or Password wrong</message>
            <label id="rememberMe"><input type="checkbox" class="customCheckbox"> Remember me</label>
            <div class="loginButtons">
                <button type="submit" class="buttonLogIn"><span class="btnTextLogin">Log in</span></button>
                <button type="button" class="buttonGuestLog"onclick="guestLogin()"><span id="guestLogText">Guest Log in</span></button>
            </div>
        </form>`;
}

function signUpForm() {
    return `<div class="arrowLeft" onclick="backToLogin()">
            <img src="./assets/buttons/arrowLeft.png" id="arrowLeft">
        </div>
        <h1 id="signUpHeader">Sign up</h1>
        <div class="vector"></div>    
        <form onsubmit="SignUp(event)" onchange="toggleSubmitButton()">
        <div class="lockWrapper">
            <input type="name" id="name" required placeholder="Name">
            <img src="./assets/icons/Login/person.svg" alt="" class="person">
        </div>
        <div class="lockWrapper">
            <input type="email" id="email" required placeholder="Email">
            <img src="./assets/icons/Login/mail.svg" alt="" class="mailSignUp">
        </div>
        <div class="lockWrapper">
            <input type="password" id="password" required placeholder="Password">
            <img src="./assets/icons/Login/lock.svg" alt="" class="lockSignUp">
        </div>
        <div class="lockWrapper">
            <input type="password" id="pwCheck" required placeholder="Confirm Password">
            <img src="./assets/icons/Login/lock.svg" alt="" class="lockSignUp2">
        </div>
        <div class="privacyCheckbox">
            <input type="checkbox" class="customCheckbox" id="checkBox" required>
            <span id="iAccept">I accept the
                <a href="loginPPolicy.html">Privacy policy</a>
            </span>
        </div>
        <div class="visabilityHidden msgBox2" id="msgBox2">Wrong password</div>
        <button type="submit" id="submitButton" class="buttonLogIn" disabled>
            <span class="btnTextLogin">
                Sign Up
            </span>
        </button>
    </form>`
}