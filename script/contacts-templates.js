

function contactBoradUserTemplate(firstNameLetter, userName, userEmail) {
    return `
    
    <div>
        <div>
            ${firstNameLetter}
        </div>

        <div>
            ${buildUserIconTemplate(userName)}
        </div>

        <div>
            ${userName}
            ${userEmail}
        </div>
    </div>

    `
}

function buildUserIconTemplate(userName) {
    let firstLetterFullName = userName;
    let getFirstLetters = firstLetterFullName.split(" ")          // Teilt den String in Wörter auf
    .map(word => word[0]) // Nimmt den ersten Buchstaben jedes Wortes
    .join("");            // Fügt die Buchstaben zu einem String zusammen
    

    return `
    
        ${getFirstLetters}
    
    `
}