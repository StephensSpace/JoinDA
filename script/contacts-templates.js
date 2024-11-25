

// Container Template zur Trennung durch Anfangsbuchstaben Firstname
function contactBoardFirstLetterHeadTemplate(USER_NAME) {
    return `
    <div class="headLetterDiv" id="headLetterDiv">

        <div class="headLetter" id="headLetter">
            ${getFirstnameLetter(USER_NAME)}
        </div>

        <hr style="width: -webkit-fill-available;">

    </div>
    ` 
}


// Erstellt das Bild Template vor dem Namen & Email des User SOWIE im contactContentTableTemplate vor dem ganzen Namen
function userIconTemplate(userName) {
    let firstLetterFullName = userName;
    if (userName.includes(" ")) {        
        let getFirstLetters = firstLetterFullName.split(" ")          // Teilt den String in Wörter auf
        .map(word => word[0])                                         // Nimmt den ersten Buchstaben jedes Wortes
        .join("");                                                    // Fügt die Buchstaben zu einem String zusammen
    
        let color = getBackgroundForLetters(getFirstLetters);
        return `
            
            <p id="userImage" style="background-color: ${color}; width: 32px; height: 32px; 
            border-radius: 100%; display: flex; justify-content: center; align-items: center;">${getFirstLetters}</p>

        `
    } else {

        let getFirstLetters = firstLetterFullName[0]; 
        return `

            <p id="userImage" style="background-color: ${'aqua'}; width: 32px; height: 32px; 
            border-radius: 100%; display: flex; justify-content: center; align-items: center;">${getFirstLetters}</p>
            
        `
    }
}


// Template für gesamte User Ansicht unter "Add new contact"
function contactBoradUserTemplate(USER_NAME, USER_EMAIL, userIndex) {
    return `
        ${contactBoardFirstLetterHeadTemplate(USER_NAME)}
        <div class="user-contact" onclick="renderContactInfosInContactsTable(${userIndex})">
            <div class="user-symbole">
                ${userIconTemplate(USER_NAME)}
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



/*


// Erstellt das Bild Template vor dem Namen & Email des User SOWIE im contactContentTableTemplate vor dem ganzen Namen
function userIconTemplate(userName) {
    let firstLetterFullName = userName;
    if (userName.includes(" ")) {        
        let getFirstLetters = firstLetterFullName.split(" ")          // Teilt den String in Wörter auf
        .map(word => word[0])                                         // Nimmt den ersten Buchstaben jedes Wortes
        .join("");                                                    // Fügt die Buchstaben zu einem String zusammen

        return getFirstLetters;
    } else {
        let getFirstLetters = firstLetterFullName[0];                                                   // Fügt die Buchstaben zu einem String zusammen
        return getFirstLetters;
    }
}

// Template für gesamte User Ansicht unter "Add new contact"
function contactBoradUserTemplate(USER_NAME, USER_EMAIL, userIndex) {
    return `
        ${contactBoardFirstLetterHeadTemplate(USER_NAME)}
        <div class="user-contact" onclick="renderContactInfosInContactsTable(${userIndex})">
            <div class="user-symbole">
                <p id="userImage${userIndex}">${userIconTemplate(USER_NAME)}</p>
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

*/




// Unter Contacts | Better with a Team Template
function contactContentTableTemplate(userIndex, USER_NAME, USER_EMAIL, USER_PHONE_NUMB) {
    return `
            <div class="contact-content-table-usernameAndIcons">
            <p style="color: lightblue;">${userIconTemplate(USER_NAME)}</p>
            <div>
                <h2>${USER_NAME}</h2>
                <div class="contact-content-table-editAndDeleteIcons">
                    <div class="editAndDeleteBtn" onclick="openEditContactModal(${userIndex})">
                        <img class="editAndDeleteBtn-Img-1" src="./assets/icons/contacts/edit.png" alt="./assets/icons/edit.png"> 
                        <img class="editAndDeleteBtn-Img hidden" src="./assets/icons/contacts/edit-hover.png" alt="./assets/icons/edit.png">
                        <p>Edit</p>
                    </div>
                    <div class="editAndDeleteBtn" onclick="deleteContact(${userIndex})">
                        <img class="editAndDeleteBtn-Img-1" src="./assets/icons/contacts/delete.png" alt="./assets/icons/delete.png"> 
                        <img class="editAndDeleteBtn-Img hidden" src="./assets/icons/contacts/delete-hover.png" alt="./assets/icons/delete.png"> 
                        <p>Delete</p>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="contact-content-table-usernameFullinformation">
            
            <p class="contact-content-information">Contact Information</p>
            
            <div>
                <h4>E-Mail</h4>
                <p><a class="user-shortcut-email" href="mailto:${USER_EMAIL}" style="text-decoration: none;">${USER_EMAIL}</a></p>
            </div>
            <div>
                <h4>Phone</h4>
                <p>${USER_PHONE_NUMB}</p>
            </div>
        </div>
    `
}

// Modal Template für Add-New Contact
function modalAddContactTemplate() {
    return `
    
    <modal onclick="closeModal()" class="modal-background" id="modal-background">
        <modal onclick="eventBubbling(event)" class="modal" id="modal">
            <div class="modal-left modal-same-padding-left">
                <div class="modal-left-div modal-same-height">
                    <img src="./assets/img/logo-2.png">
                    <h1>Add contact</h1>
                    <p>Tasks are better with a team!</p>
                    <hr>
                </div>
            </div>

            <div class="modal-right modal-same-padding-right">
                <div class="modal-right-div modal-same-height">
                    
                    <div class="modal-right-bottom">

                        <div class="modal-userImg">
                            <img src="./assets/icons/contacts/person.png">
                        </div>

                        <div class="modal-inputfield-div">
                            <div class="modal-right-top">
                                <img onclick="closeModal()" src="./assets/icons/contacts/Vector-X.png">
                            </div>
                            
                            <form onsubmit="addNewContact(); return false">
                                <div class="modal-inputfield">
                                    <input type="text" name="name" id="inputName" class="person-icon" placeholder="Name" required>
                                    <input type="email" name="email" id="inputEmail" class="check-icon" placeholder="Email" required>
                                    <input type="tel" name="phone" id="inputPhone" class="phone-icon" placeholder="Phone" required> 
                                </div>
                            
                                <div class="modal-inputfield-buttons">
                                    <button id="cancelBtn" type="button" onclick="closeModal()" style="background: var(--background-color-header);">Cancel <img class="cancel-icon" src="./assets/icons/contacts/Vector-X.png"></button>
                                    <button id="createContactBtn" type="submit" style="background: var(--background-color-nav); color: white;">Create contact <img src="./assets/icons/contacts/check.png"></button>
                                </div>
                            </form>

                        </div>

                    </div>
                </div>
            </div>
        </modal>
    </modal>
    `
}

// Modal Template für Edit
function modalEditContactTemplate(userIndex) {
    return `
    
    <modal onclick="closeModal()" class="modal-background" id="modal-background">
        <modal onclick="eventBubbling(event)" class="modal" id="modal">
            <div class="modal-left modal-same-padding-left">
                <div class="modal-left-div modal-same-height">
                    <img src="./assets/img/logo-2.png">
                    <h1>Edit contact</h1>
                    <hr>
                </div>
            </div>

            <div class="modal-right modal-same-padding-right">
                <div class="modal-right-div modal-same-height">
                    
                    <div class="modal-right-bottom">

                        <div class="modal-userImg">
                            <img src="./assets/icons/contacts/person.png">
                        </div>

                        <div class="modal-inputfield-div">
                            <div class="modal-right-top">
                                <img onclick="closeModal()" src="./assets/icons/contacts/Vector-X.png">
                            </div>
                            
                            <form onsubmit="editContactInModal(${userIndex}); return false">
                                <div class="modal-inputfield">
                                    <input type="text" name="name" id="inputName" class="person-icon" placeholder="Name" required>
                                    <input type="email" name="email" id="inputEmail" class="check-icon" placeholder="Email" required>
                                    <input type="tel" name="phone" id="inputPhone" class="phone-icon" placeholder="Phone" required> 
                                </div>
                            
                                <div class="modal-inputfield-buttons">
                                    <button id="cancelBtn" type="button" onclick="deleteContact(${userIndex})" style="background: var(--background-color-header);">Delete</button>
                                    <button id="createContactBtn" type="submit" style="background: var(--background-color-nav); color: white;">Save <img src="./assets/icons/contacts/check.png"></button>
                                </div>
                            </form>

                        </div>

                    </div>
                </div>
            </div>
        </modal>
    </modal>
    `
}