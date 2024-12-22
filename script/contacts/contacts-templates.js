// Für Desktop

/**
 * Container Template zur Trennung durch Anfangsbuchstaben vom Vornamen.
 * 
 * @function contactBoardFirstLetterHeadTemplate
 * @param {string} USER_NAME Parameter der den ganzen Namen übergibt
 * @returns {string} Das HTML-Template für die Anzeige des obersten Buchstaben in der Kontaktliste.
 * @example
 * "A", "B" oder "C" bis zu "Z".
 */
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

/**
 * Erstellt das ICON vor dem Namen & Email des Kontakts in der Kontaktliste.
 * 
 * @function userIconTemplateContactList
 * @param {string} USER_NAME Parameter der den ganzen Namen übergibt
 * @param {number} userIndex Der Index des Kontakts in der Kontaktliste
 * @returns {string} Das HTML-Template für die Anzeige des UserIcon in der Kontaktliste vor dem vollen Namen eines Kontakts.
 * @example
 * "AM" -> mit der Background Color bspw. Orange
 */
function userIconTemplateContactList(USER_NAME, userIndex) {
    let firstLetterFullName = USER_NAME;
    if (USER_NAME.includes(" ")) {        
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

/**
 * Erstellt das ICON vor dem Namen des Kontakts in dem Content-Table.
 * 
 * @function userIconTemplateContactTable
 * @param {string} USER_NAME Parameter der den ganzen Namen übergibt
 * @param {number} userIndex Der Index des Kontakts in der Kontaktliste
 * @returns {string} Das HTML-Template für das User Icon im Contact Table.
 * @example
 * "AM" -> mit der Background Color bspw. Orange. in dem Content-Table
 */
function userIconTemplateContactTable(USER_NAME, userIndex) {
    let firstLetterFullName = USER_NAME;
    if (USER_NAME.includes(" ")) {        
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

/**
 * Template für jeden gerenderten Kontakt unter "Add new contact" in der Kontaktliste.
 * 
 * @function contactBoradUserTemplate
 * @param {string} USER_NAME Parameter der den ganzen Namen übergibt
 * @param {string} USER_EMAIL Parameter der die E-Mail übergibt
 * @param {number} userIndex Der Index des Kontakts in der Kontaktliste
 * @returns {string} Das HTML-Template für die Kontakte in der Kontaktliste.
 */
function contactBoradUserTemplate(USER_NAME, USER_EMAIL, userIndex) {
    return `
        ${contactBoardFirstLetterHeadTemplate(USER_NAME)}
        <div class="user-contact" onclick="renderContactInfosInContactsTable(${userIndex})">
            <div class="user-symbole">
                ${userIconTemplateContactList(USER_NAME, userIndex)}
            </div>
            <div class="user-shortcut-info">
                <div>
                    <p class="user-shortcut-name" style="color: black">${USER_NAME}</p>
                </div>
                <div>
                    <p class="user-shortcut-email"  style="color: #007CEE !important;">${USER_EMAIL}</p>
                </div>
            </div>
        </div>
    `
}

/**
 * Template für die gesamten Kontakt-Informationen im Contact Table. 
 * 
 * @function contactContentTableTemplate
 * @param {string} USER_NAME Parameter der den ganzen Namen übergibt
 * @param {string} USER_EMAIL Parameter der die E-Mail übergibt
 * @param {string} USER_PHONE_NUMB Parameter der die Telefonummer übergibt

 * @returns {string} Das HTML-Template für die gesamte Kontakt-Information im Contact Table.
 */
function contactContentTableTemplate(userIndex, USER_NAME, USER_EMAIL, USER_PHONE_NUMB) {
    return `
        <div class="contact-content-table-usernameAndIcons flyAnimation">
            <div class="userIconTable">
                ${userIconTemplateContactTable(USER_NAME, userIndex)}
            </div>
            <div class="userIconTableNameDiv">
                <div> 
                    <span style="font-weight: 500;">${USER_NAME}</span> 
                </div>
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
        <div class="contact-content-table-usernameFullinformation flyAnimation">
            <p class="contact-content-information">
                Contact Information
            </p>
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

/**
 * Das Modal Template für Add-New Contact.
 * 
 * @function modalAddContactTemplate
 * @returns {string} Das HTML-Template für das gesamte "Add Contact" Modal.
 */
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
                                        <img onclick="closeModal()" src="./assets/icons/contacts/Vector-X.png" id="closeX">
                                    </div>
                                </div>
                                <form onsubmit="addNewContactFunc(); return false" novalidate>
                                    <div class="modal-inputfield">
                                        <input type="text" name="name" id="inputName" class="person-icon" placeholder="Name" oninput="checkInputValid()">
                                        <input type="email" name="email" id="inputEmail" class="check-icon" placeholder="Email" oninput="checkMail(this.value)">
                                        <span id="msgBoxMail" class="dNone"></span>
                                        <input type="tel" name="phone" id="inputPhone" class="phone-icon" placeholder="Phone" oninput="checkPhone(this.value)"> 
                                        <span id="msgBoxTel" class="dNone"></span>
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

/**
 * Das Modal Template für Edit Contact.
 * 
 * @function modalEditContactTemplate
 * @param {number} userIndex Der Index des Kontakts in der Kontaktliste
 * @param {string} USER_NAME Parameter der den ganzen Namen übergibt
 * @returns {string} Das HTML-Template für das gesamte "Edit Contact" Modal.
 */
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
                                    <img onclick="closeModal()" src="./assets/icons/contacts/Vector-X.png" id="closeX">
                                </div>
                                <form onsubmit="editContactInModal(${userIndex}); return false" novalidate>
                                    <div class="modal-inputfield">
                                        <input type="text" name="name" id="inputName" class="person-icon" placeholder="Name" oninput="checkInputValidEdit()">
                                        <input type="email" name="email" id="inputEmail" class="check-icon" placeholder="Email" oninput="checkMailEdit(this.value)">
                                        <span id="msgBoxMail" class="dNone"></span>
                                        <input type="tel" name="phone" id="inputPhone" class="phone-icon" placeholder="Phone" oninput="checkPhoneEdit(this.value)"> 
                                        <span id="msgBoxTel" class="dNone"></span>
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

/**
 * Template für die "Contact Successfully Created" Div.
 * 
 * @function contactSuccessfullyCreatedTemplate
 * @returns {string}  Das HTML-Template für das animierte "Contact Successfully Created".
 */
function contactSuccessfullyCreatedTemplate() {
    return `
        <div class="contactSuccessfullyCreated" style="background: #2A3647; color: white; width: 326px; height: 74px; 
        border-radius: 20px; display: flex; align-items: center; justify-content: center; font-size: 20px; position: absolute;
        bottom: 128px; z-index: 99;">
            <p>
                Contact successfully created
            </p>
        </div>
    `
}
