
// Zum zurück kommen vom Contact Table zur Contact List
function goBackToContactList() {
    document.getElementsByClassName('contact-board')[0].style.display = "flex";
    document.getElementsByClassName('contact-content')[0].style.display = "none";
    document.getElementById('contact-content-table').innerHTML = "";
}


// Funktion zum rendern der User Details ins Contact Content Table
function renderContactInfosInContactsTableMobile(index) {
    document.getElementsByClassName('contact-content')[0].style.display = "flex";
    document.getElementsByClassName('contact-board')[0].style.display = "none";
    renderContactInfosInContactsTable(index);
}
