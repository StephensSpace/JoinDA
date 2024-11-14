

// Container Template zur Trennung durch Anfangsbuchstaben Firstname

function contactBoardFirstLetterHeadTemplate(USER_NAME) {
    

    return `

    <div class="headLetterDiv" id="headLetterDiv">

        <div class="headLetter" id="headLetter">${getFirstnameLetter(USER_NAME)}</div>
        <hr style="width: -webkit-fill-available;">

    </div>

    ` 
}


// Erstellt das Bild Template vor dem Namen & Email des User
function userIconTemplate(userName) {
    let firstLetterFullName = userName;
    let getFirstLetters = firstLetterFullName.split(" ")          // Teilt den String in Wörter auf
    .map(word => word[0])                                         // Nimmt den ersten Buchstaben jedes Wortes
    .join("");                                                    // Fügt die Buchstaben zu einem String zusammen
    

    return `
        
        ${getFirstLetters}
    
    `
}


// Template für gesamte User Ansicht unter "Add new contact"
function contactBoradUserTemplate(USER_NAME, USER_EMAIL) {

    return `

        ${contactBoardFirstLetterHeadTemplate(USER_NAME)}
        <div class="user-contact">
            <div class="user-symbole">
                <p style="color: lightblue;">${userIconTemplate(USER_NAME)}</p>
            </div>
            <div class="user-shortcut-info">
                <div>
                    <p>${USER_NAME}</p>
                </div>
                <div>
                    <a href="mailto:${USER_EMAIL}" style="text-decoration: none;">${USER_EMAIL}</a>
                </div>
            </div>
        </div>
    `

}

