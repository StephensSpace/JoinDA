
// Zum zurück kommen vom Contact Table zur Contact List
async function goBackToContactList() {
    document.getElementsByClassName('contact-content')[0].style.display = "none";
    document.getElementsByClassName('contact-board')[0].style.display = "unset";


    document.getElementById('contact-content-table').innerHTML = "";

    document.getElementsByClassName('edit-delete-btn-background')[0].remove();  


    document.getElementsByClassName('content')[0].innerHTML +=
    `<div class="add-new-contact-background">
            <div class="add-new-contact-btn" onclick="openAddContactModal()">
                    <img src="./assets/icons/contacts/person_add.png" alt="./assets/icons/contacts/person_add.png">
            </div>
    </div>`;
}


// Funktion zum rendern der User Details ins Contact Content Table
function renderContactInfosInContactsTableMobile(index) {
    document.getElementsByClassName('contact-content')[0].style.display = "flex";
    document.getElementsByClassName('contact-board')[0].style.display = "none";


    renderContactInfosInContactsTable(index);


    document.getElementsByClassName('content')[0].innerHTML +=      
    `<div class="edit-delete-btn-background" onclick="openPopupDiv()">
            <div class="edit-delete-btn" onclick="">
                <img src="./assets/icons/contacts/more_vert.png" alt="./assets/icons/contacts/more_vert.png">
            </div>
    </div>`;


    document.getElementsByClassName('add-new-contact-background')[0].remove();
}


// Get Popup-Div 

function openPopupDiv() {
    if (document.getElementById('popupDiv') == null) {        // Wenn Popup doc... = true; also wenn er da ist, dann else
        document.getElementsByClassName('content')[0].innerHTML += 
        `<div class="popupDiv" id="popupDiv" onclick="eventBubbling(event)">

            <img src="./assets/icons/contacts/more_vert.png" alt="./assets/icons/contacts/more_vert.png">
        
        </div>`
    } else {
                            // Close Popup Dialog
        document.getElementById('popupDiv').remove()
    }
}