
// Zum zurück kommen vom Contact Table zur Contact List
function goBackToContactList() {
    document.getElementsByClassName('contact-board')[0].style.display = "unset";
    document.getElementById('contact-content-table').innerHTML = "";

    // entfern den edit und delete button in der Kontaktlisten Ansicht
    document.getElementsByClassName('edit-delete-btn-background')[0].remove();  

    // fügt button "add new contact" hinzu 
    document.getElementsByClassName('content')[0].innerHTML += addNewContactBtnTemplate();

    // Entfernt das Kontakt Details Template von der HTML 
    document.getElementsByClassName('contact-content')[0].remove()
}

// Funktion zum rendern der User Details ins Contact Content Table
function renderContactInfosInContactsTableMobile(index) {
    //document.getElementsByClassName('contact-content')[0].style.display = "flex";
    document.getElementsByClassName('contact-board')[0].style.display = "none";

    //  fügt Kontaktinformation Template + button edit contact hinzu 
    document.getElementsByClassName('content')[0].innerHTML += contactContentTemplate() + editAndDeleteBtnTemplate();

    // Get Contact information into "contact-content-table"
    renderContactInfosInContactsTable(index);

    // entfernt den add new contact button in der Kontakt Details Ansicht
    document.getElementsByClassName('add-new-contact-background')[0].remove();
}

// openup Popup-Div 
function openPopupDiv() {
    if (document.getElementById('popupDiv') == null) {        // Wenn Popup doc... = true; also wenn er da ist, dann else
        //document.getElementsByClassName('content')[0].innerHTML += editAndDeletePopUpDivTemplate();
        document.getElementsByClassName('contact-content-table-editAndDeleteIcons')[0].style.display = "unset";
    }
}

// closing Popup-Div through click on the background
function closePopupDiv() {
    document.getElementsByClassName('contact-content-table-editAndDeleteIcons')[0].style.display = "none";
}