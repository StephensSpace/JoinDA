// Für Mobile

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
function userIconTemplateContactTable(userName, userIndex) {
    let firstLetterFullName = userName;
    if (userName.includes(" ")) {        
        let getFirstLetters = firstLetterFullName.split(" ")          // Teilt den String in Wörter auf
        .map(word => word[0])                                         // Nimmt den ersten Buchstaben jedes Wortes
        .join("");                                                    // Fügt die Buchstaben zu einem String zusammen
    
        let color = document.getElementById(`userIconContactList_${(userIndex)}`)?.style.backgroundColor;
        return `
            <p id="userIconContactTable-${userIndex}" class="modalUserIcon" style="background-color: ${color}; width: 80px; height: 80px; 
            border-radius: 100%; color: white; display: flex; justify-content: center; align-items: center; font-size: 27px;">${getFirstLetters}</p> 
        `
    } else {

        let getFirstLetters = firstLetterFullName[0]; 
        return `
            <p id="userIconContactTable-${userIndex}" class="modalUserIcon" style="background-color: ${'aqua'}; width: 80px; height: 80px; 
            border-radius: 100%; display: flex; justify-content: center; align-items: center; font-size: 27px;">${getFirstLetters}</p>
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
        <div class="user-contact" onclick="renderContactInfosInContactsTableMobile(${userIndex})">
            <div class="user-symbole">
                ${userIconTemplateContactList(USER_NAME, userIndex)}
            </div>
            <div class="user-shortcut-info">
                <div>
                    <p class="user-shortcut-name" style="color: black">${USER_NAME}</p>
                </div>
                <div>
                    <p class="user-shortcut-email" href="" style="color: #007CEE !important;">${USER_EMAIL}</p>
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
        <div class="contact-content-table-usernameAndIcons">
            <div class="userIconTable-Background">
                <div class="userIconTable">
                    ${userIconTemplateContactTable(USER_NAME, userIndex)}
                </div>
            </div>
            <div class="userIconTableNameDiv">
                <div> <span style="font-weight: 500;">${USER_NAME}</span> </div>
                <div class="contact-content-table-editAndDeleteIcons dNone" onclick="eventBubbling(event)">
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
                <h4>Email</h4>
                <p>
                    <a href="mailto:${USER_EMAIL}" style="text-decoration: none; color: #007CEE;">${USER_EMAIL}</a>
                </p>
                <h4>Phone</h4>
                <p>${USER_PHONE_NUMB}</p>
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
                <div class="modal-userImg-Background">
                    <div class="modal-userImg">
                        <img src="./assets/icons/contacts/person-addNewContact.png">
                    </div>
                </div>
                <div class="modal-left">
                    <div class="modal-left-div">
                        <h1>Add contact</h1>
                        <p>Tasks are better with a team!</p>
                        <hr>
                    </div>
                    <div class="modal-left-top">
                        <img onclick="closeModal()" src="./assets/icons/contacts/Vector-X-white.png" id="closeX">
                    </div>
                </div>

                <div class="modal-right">
                    <div class="modal-right-div">

                        <div class="modal-right-bottom">

                            <div class="modal-inputfield-div">

                                <form onsubmit="addNewContactMobile(); return false" novalidate>
                                    <div class="modal-inputfield">
                                        <input type="text" name="name" id="inputName" class="person-icon" placeholder="Name" oninput="checkInputValid()">
                                        <input type="email" name="email" id="inputEmail" class="check-icon" placeholder="Email" oninput="checkMail(this.value)">
                                        <span id="msgBoxMail" class="dNone"></span>
                                        <input type="tel" name="phone" id="inputPhone" class="phone-icon" placeholder="Phone" oninput="checkPhone(this.value)"> 
                                        <span id="msgBoxTel" class="dNone"></span>
                                    </div>

                                    <div class="modal-inputfield-buttons">

                                        <button id="createContactBtn_addContact" type="submit" style="background: var(--background-color-nav); color: white;">
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
                <div class="modal-userIcon-name">
                    <div class="modal-userImg-Background">
                        <div class="modal-userIcon-name-div">
                            ${userIconTemplateContactTable(USER_NAME, userIndex)}
                        </div>
                    </div>
                </div>
                <div class="modal-left">
                    <div class="modal-left-div">
                        <h1>Edit contact</h1>
                        <hr>
                    </div>
                    <div class="modal-left-top">
                        <img onclick="closeModal()" src="./assets/icons/contacts/Vector-X-white.png" id="closeX">
                    </div>
                </div>

                <div class="modal-right">
                    <div class="modal-right-div">

                        <div class="modal-right-bottom">

                            <div class="modal-inputfield-div">
                                <form onsubmit="editContactInModal(${userIndex}); return false" novalidate>
                                    <div class="modal-inputfield">
                                        <input type="text" name="name" id="inputName" class="person-icon" placeholder="Name" oninput="checkInputValidEdit()">
                                        <input type="email" name="email" id="inputEmail" class="check-icon" placeholder="Email" oninput="checkMailEdit(this.value)">
                                        <span id="msgBoxMail" class="dNone"></span>
                                        <input type="tel" name="phone" id="inputPhone" class="phone-icon" placeholder="Phone" oninput="checkPhoneEdit(this.value)"> 
                                        <span id="msgBoxTel" class="dNone"></span>
                                    </div>

                                    <div class="modal-inputfield-buttons">
                                        <button id="cancelBtn" type="button" onclick="deleteContactMobile(${userIndex})" style="background: var(--background-color-header);">Delete</button>
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
        left: 50%; translate: -50%; bottom: 64px; z-index: 99;">
            <p>
                Contact successfully created
            </p>
        </div>
    `
}
