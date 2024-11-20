

// Container Template zur Trennung durch Anfangsbuchstaben Firstname
function contactBoardFirstLetterHeadTemplate(USER_NAME) {
    return `
    <div class="headLetterDiv" id="headLetterDiv">

        <div class="headLetter" id="headLetter">${getFirstnameLetter(USER_NAME)}</div>
        <hr style="width: -webkit-fill-available;">

    </div>
    ` 
}


// Erstellt das Bild Template vor dem Namen & Email des User SOWIE im contactContentTableTemplate vor dem ganzen Namen
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
        <div class="user-contact" onclick="renderContactInfosInContactsTable(${userIndex})">
            <div class="user-symbole">
                <p id="userImage${userIndex}" style="color: lightblue;">${userIconTemplate(USER_NAME)}</p>
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
function contactContentTableTemplate(userIndex, USER_NAME, USER_EMAIL, USER_PHONE_NUMB) {
    return `
            <div class="contact-content-table-usernameAndIcons">
            <p style="color: lightblue;">${userIconTemplate(USER_NAME)}</p>
            <div>
                <h2>${USER_NAME}</h2>
                <div class="contact-content-table-editAndDeleteIcons">
                    <div onclick="openEditContactModal(${userIndex})">
                        <img src="./assets/icons/edit.png" alt="./assets/icons/edit.png"> 
                        <p>Edit</p>
                    </div>
                    <div onclick="deleteContact(${userIndex})">
                        <img src="./assets/icons/delete.png" alt="./assets/icons/delete.png"> 
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

            <div class="modal-inputfield">

                <form>
                    <input type="text" name="" id="" class="person-icon" placeholder="Name">
                    
                </form>

                <form>
                    <input type="email" name="" id="" class="check-icon" placeholder="Email">
                </form>

                <form>
                    <input type="text" name="" id="" class="phone-icon" placeholder="Phone">
                </form>

                <div>
                    <button type="submit" onclick="">Cancel <img src="./assets/icons/contacts/Vector-X.png"></button>
                    <button type="submit" onclick="">Create contact <img src="./assets/icons/contacts/check.png"></button>
                </div>

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

        <div class="modal-right">
            
            
            <div>
                <img src="./assets/icons/person.png">
            </div>

            <div>
                <input type="text" name="" id="">
                <input type="email" name="" id="">
                <input type="text" name="" id="">
            </div>
            

                        </div>

                    </div>
                </div>
            </div>
        </modal>
    </modal>
    `
}