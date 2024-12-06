
// Zum zurück kommen vom Contact Table zur Contact List
function goBackToContactList() {
    document.getElementsByClassName('contact-board')[0].style.display = "flex";
    document.getElementsByClassName('contact-content')[0].style.display = "none";
    document.getElementById('contact-content-table').innerHTML = "";

    document.getElementsByClassName('add-new-contact-background')[1].remove();  //   classe wird noch geändert!!

}


// Funktion zum rendern der User Details ins Contact Content Table
function renderContactInfosInContactsTableMobile(index) {
    document.getElementsByClassName('contact-content')[0].style.display = "flex";
    document.getElementsByClassName('contact-board')[0].style.display = "none";
    renderContactInfosInContactsTable(index);


    document.getElementsByClassName('content')[0].innerHTML +=      // classe wird noch geändert!!
    `<div class="add-new-contact-background">
            <div class="add-new-contact-btn" onclick="">
                <p>...</p>
            </div>
    </div>`;
}
