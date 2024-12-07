

// Container Template zur Trennung durch Anfangsbuchstaben Firstname
function contactBoardFirstLetterHeadTemplate(USER_NAME) {
    return `
    <div class="headLetterDiv" id="headLetterDiv">

        <div class="headLetter" id="headLetter">
            ${getFirstnameLetter(USER_NAME)}
        </div>

        <hr style="width: -webkit-fill-available; margin-bottom: 8px; ">

    </div>
    ` 
}

// Erstellt das ICON-Template vor dem Namen & Email des User in der Kontaktliste
function userIconTemplateContactList(userName, userIndex) {
    let firstLetterFullName = userName;
    if (userName.includes(" ")) {        
        let getFirstLetters = firstLetterFullName.split(" ")          // Teilt den String in Wörter auf
        .map(word => word[0])                                         // Nimmt den ersten Buchstaben jedes Wortes
        .join("");                                                    // Fügt die Buchstaben zu einem String zusammen
        
        let color = getBackgroundForDefinedLetters(getFirstLetters);
        if (color == undefined || rgbInHexa(userIndex) == color) {
            color = getRandomeColor(color);   
        }
        return `
            
            <p id="userIconContactList_${userIndex}" style="background-color: ${color}; width: 32px; height: 32px; 
            border-radius: 100%; display: flex; justify-content: center; align-items: center;">${getFirstLetters}</p>

        `
    } else {

        let getFirstLetters = firstLetterFullName[0]; 
        return `

            <p id="userIconContactList_${userIndex}" style="background-color: ${'aqua'}; width: 32px; height: 32px; 
            border-radius: 100%; display: flex; justify-content: center; align-items: center;">${getFirstLetters}</p>
            
        `
    }
}

// Erstellt das ICON-Template vor dem Namen des User in dem Content-Table
function userIconTemplateContactTable(userName, userIndex) {
    let firstLetterFullName = userName;
    if (userName.includes(" ")) {        
        let getFirstLetters = firstLetterFullName.split(" ")          // Teilt den String in Wörter auf
        .map(word => word[0])                                         // Nimmt den ersten Buchstaben jedes Wortes
        .join("");                                                    // Fügt die Buchstaben zu einem String zusammen
    
        let color = document.getElementById(`userIconContactList_${(userIndex)}`)?.style.backgroundColor;
        return `
            
            <p id="userIconContactTable-${userIndex}" style="background-color: ${color}; width: 120px; height: 120px; 
            border-radius: 100%; color: white; display: flex; justify-content: center; align-items: center; font-size: 48px;">${getFirstLetters}</p>
            
        `
    } else {

        let getFirstLetters = firstLetterFullName[0]; 
        return `
              
            <p id="userIconContactTable-${userIndex}" style="background-color: ${'aqua'}; width: 120px; height: 120px; 
            border-radius: 100%; display: flex; justify-content: center; align-items: center;">${getFirstLetters}</p>
            
        `
    }
}

// Template für gesamte User Ansicht unter "Add new contact"
function contactBoradUserTemplate(USER_NAME, USER_EMAIL, userIndex) {
    return `
        ${contactBoardFirstLetterHeadTemplate(USER_NAME)}
        <div class="user-contact" onclick="renderContactInfosInContactsTableMobile(${userIndex})">
            <div class="user-symbole">
                ${userIconTemplateContactList(USER_NAME, userIndex)}
            </div>
            <div class="user-shortcut-info">
                <div>
                    <p class="user-shortcut-name" style="color: black">${USER_NAME}</p>
                </div>
                <div>
                    <p class="user-shortcut-email" href="" style="color: #007CEE;">${USER_EMAIL}</p>
                </div>
            </div>
        </div>
    `
}

// Unter Contacts | Better with a Team Template
function contactContentTableTemplate(userIndex, USER_NAME, USER_EMAIL, USER_PHONE_NUMB) {
    return `
        <div class="contact-content-table-usernameAndIcons">
            <div class="userIconTable">
                ${userIconTemplateContactTable(USER_NAME, userIndex)}
            </div>
            <div class="userIconTableNameDiv">
                <div> <span style="font-weight: 500;">${USER_NAME}</span> </div>
                <div class="contact-content-table-editAndDeleteIcons dNone">
                    <div class="editAndDeleteBtn" onclick="openEditContactModal(${userIndex})">
                        <img class="editAndDeleteBtn-Img-1" src="./assets/icons/contacts/edit.png" alt="./assets/icons/edit.png"> 
                        <img class="editAndDeleteBtn-Img hidden" src="./assets/icons/contacts/edit-hover.png" alt="./assets/icons/edit.png">
                        <p>Edit</p>
                    </div>
                    <div class="editAndDeleteBtn1" onclick="deleteContactMobile(${userIndex})">
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
                <p><a href="mailto:${USER_EMAIL}" style="text-decoration: none;">${USER_EMAIL}</a></p>
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
                <div class="modal-left-div modal-same-padding">
                    
                    <img src="./assets/img/logo-2.png">
                    <h1>Add contact</h1>
                    <p>Tasks are better with a team!</p>
                    
                    <hr>
                </div>
            </div>

            <div class="modal-right modal-same-padding-right">
                <div class="modal-right-div modal-same-padding">
                    
                    <div class="modal-right-bottom">
                        <div class="modal-userImg-Background">
                            <div class="modal-userImg">
                                <img src="./assets/icons/contacts/person-addNewContact.png">
                            </div>
                        </div>

                        <div class="modal-inputfield-div">
                            <div class="modal-right-top">
                                <div>
                                    <img onclick="closeModal()" src="./assets/icons/contacts/Vector-X.png">
                                </div>
                            </div>
                            
                            <form onsubmit="addNewContact(); return false">
                                <div class="modal-inputfield">
                                    <input type="text" name="name" id="inputName" class="person-icon" placeholder="Name" required>
                                    <input type="email" name="email" id="inputEmail" class="check-icon" placeholder="Email" required>
                                    <input type="tel" name="phone" id="inputPhone" class="phone-icon" placeholder="Phone" required> 
                                </div>
                            
                                <div class="modal-inputfield-buttons">
                                    <button id="cancelBtn" type="button" onclick="closeModal()" style="background: var(--background-color-header);">
                                        <p>Cancel</p> 

                                        <div>
                                            <img id="cancel-icon" class="cancel-icon hidden" src="./assets/icons/contacts/Vector-X-blue.png">
                                            <img id="cancel-icon1" class="cancel-icon" src="./assets/icons/contacts/Vector-X.png">
                                        </div>
                                    </button>
                                    
                                    <button id="createContactBtn" type="submit" style="background: var(--background-color-nav); color: white;">
                                        <p>Create contact</p>
                                        
                                        <div>
                                            <img class="create-icon" src="./assets/icons/contacts/check.png">
                                        </div>
                                    </button>
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
function modalEditContactTemplate(userIndex, USER_NAME) {
    return `
    
    <modal onclick="closeModal()" class="modal-background" id="modal-background">
        <modal onclick="eventBubbling(event)" class="modal" id="modal">
            <div class="modal-left modal-same-padding-left">
                <div class="modal-left-div modal-same-padding">
                    <img src="./assets/img/logo-2.png">
                    <h1>Edit contact</h1>
                    <hr>
                </div>
            </div>

            <div class="modal-right modal-same-padding-right">
                <div class="modal-right-div modal-same-padding">
                    
                    <div class="modal-right-bottom">
                    
                        <div class="modal-userIcon-name">
                            <div class="modal-userIcon-name-div">
                                ${userIconTemplateContactTable(USER_NAME, userIndex)}
                            </div>
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

// Add-New-Contact-Btn Template
function addNewContactBtnTemplate() {
    return `<div class="add-new-contact-background">
                <div class="add-new-contact-btn" onclick="openAddContactModal()">
                    <img src="./assets/icons/contacts/person_add.png" alt="./assets/icons/contacts/person_add.png">
                </div>
            </div>`;
}

// Edit And Delete Button in Mobile Popup Div
function editAndDeleteBtnTemplate() {
    return `<div class="edit-delete-btn-background" onclick="openPopupDiv()">
                <div class="edit-delete-btn" onclick="">
                    <img src="./assets/icons/contacts/more_vert.png" alt="./assets/icons/contacts/more_vert.png">
                </div>
            </div>`
}

// Kontakt Information Template
function contactContentTemplate() {
    return `<div class="contact-content" onclick="closePopupDiv()">
                <div class="contact-content-head">
                    <div class="contact-content-tilte">
                        <h1>Contacts</h1>
                        <hr>
                        <p>Better with a team</p>
                    </div>
                    <div>
                        <div class="contact-content-back" onclick="goBackToContactList(), eventBubbling(event)" > 
                            <img src="./assets/icons/contacts/Vector-arrow-mobile.png" alt="./assets/icons/contacts/Vector-arrow-mobile.png">
                        </div>
                    </div>
                </div>
                <div class="contact-content-table" id="contact-content-table">

                </div>
            </div>`
}

// Popup-Div Template    MUSS DOCH WEG; UNNÖTIG???
function editAndDeletePopUpDivTemplate() {
    return `<div class="popupDiv" id="popupDiv" onclick="eventBubbling(event)">

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

            </div>`
}


















