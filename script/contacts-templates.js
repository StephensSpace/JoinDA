
// Template für gesamte User Ansicht unter "Add new contact"
function contactBoradUserTemplate(userName, userEmail) {
    return `
    
    <div>
        <div>
            ${buildUserIconTemplate(userName)}
        </div>

        <div>
            ${userName}
        </div>

        <div>
            <a href="mailto:${userEmail}" style="text-decoration: none;">${userEmail}</a>
        </div>
    </div>

    `
}

// Erstellt das Bild Template vor dem Namen & Email des User
function buildUserIconTemplate(userName) {
    let firstLetterFullName = userName;
    let getFirstLetters = firstLetterFullName.split(" ")          // Teilt den String in Wörter auf
    .map(word => word[0]) // Nimmt den ersten Buchstaben jedes Wortes
    .join("");            // Fügt die Buchstaben zu einem String zusammen
    

    return `
    
        ${getFirstLetters}
    
    `
}