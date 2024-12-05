
// Zum zurück kommen vom Contact Table zur Contact List
function goBackToContactList() {
    document.getElementsByClassName('contact-board')[0].style.display = "flex";
    document.getElementById('contact-content-table').style.display = "none";
}


// Funktion zum rendern der User Details ins Contact Content Table
function renderContactInfosInContactsTableMobile(index) {
    document.getElementById('contact-content-table').style.display = "block";
    document.getElementsByClassName('contact-board')[0].style.display = "none";
    renderContactInfosInContactsTable(index);
}
