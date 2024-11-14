




// Container Template zur Trennung durch Anfangsbuchstaben Firstname

function contactBoardFirstLetterHeadTemplate(USER_NAME) {
    return `
    
        ${checkFirstnameLetter(USER_NAME)}
        <hr>
        ${checkIfFirstnameLetterMatching(USER_NAME)}
    `
}





// Template für gesamte User Ansicht unter "Add new contact"
function contactBoradUserTemplate(USER_NAME, USER_EMAIL) {
    return `
    
    <div class="headLetter" id="headLetter">${checkFirstnameLetter(USER_NAME)}</div>
    <hr style="width: -webkit-fill-available;">
    <div class="user-contact">
        <div>
            <p style="color: red;">${userIconTemplate(USER_NAME)}</p>
        </div>

        <div>
            ${USER_NAME}
        </div>

        <div>
            <a href="mailto:${USER_EMAIL}" style="text-decoration: none;">${USER_EMAIL}</a>
        </div>
    </div>

    `
}

// Erstellt das Bild Template vor dem Namen & Email des User
function userIconTemplate(userName) {
    let firstLetterFullName = userName;
    let getFirstLetters = firstLetterFullName.split(" ")          // Teilt den String in Wörter auf
    .map(word => word[0]) // Nimmt den ersten Buchstaben jedes Wortes
    .join("");            // Fügt die Buchstaben zu einem String zusammen
    

    return `
    
        ${getFirstLetters}
    
    `
}