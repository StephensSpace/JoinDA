

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
function contactBoradUserTemplate(USER_NAME, USER_EMAIL, userIndex) {
    //${(USER_NAME).split(" ")[0]} statt userIndex
    return `

        ${contactBoardFirstLetterHeadTemplate(USER_NAME)}
        <div class="user-contact" onclick="getUserInfoInContacts(${userIndex})">
            <div class="user-symbole">
                <p style="color: lightblue;">${userIconTemplate(USER_NAME)}</p>
            </div>
            <div class="user-shortcut-info">
                <div>
                    <p class="user-shortcut-name">${USER_NAME}</p>
                </div>
                <div>
                    <a class="user-shortcut-email" href="mailto:${USER_EMAIL}" style="text-decoration: none;">${USER_EMAIL}</a>
                </div>
            </div>
        </div>
    `

}




// Unter Contacts | Better with a Team Template
function contactContentTableTemplate(USER_NAME, USER_EMAIL, USER_PHONE_NUMB) {
    return `
    <div>

        <div>
            <img>
            <div>
                <p>${USER_NAME}</p>
                <div style="display: flex; gap: 16px;">
                    <div style="display: flex; align-items: center; gap: 4px;">
                        <img src="./assets/icons/edit.png" alt="./assets/icons/edit.png"> 
                        <p>Edit</p>
                    </div>
                    <div style="display: flex; align-items: center; gap: 4px;">
                        <img src="./assets/icons/delete.png" alt="./assets/icons/delete.png"> 
                        <p>Delete</p>
                    </div>
                </div>
            </div>
        </div>
        
        <div>
            <div>
                <p>Contact Information</p>
            </div>
            <div>
                <p>E-Mail</p>
                <a class="user-shortcut-email" href="mailto:${USER_EMAIL}" style="text-decoration: none;">${USER_EMAIL}</a>
            </div>
            <div>
                <p>Phone</p>
                <p>${USER_PHONE_NUMB}</p>
            </div>
        </div>

    </div>
    `
}