// Kimberly Raymer
// Date 09/18/2023

//fieldMaps are for filling out confirm.html
const fieldMap = [
    ['cRegisterBy', 'registeredBy'],
    ['cfName', 'name'],
    ['cEmail', 'email'],
    ['cCountry', 'country'],
    ['cAddress', 'address'],
    ['cCity', 'city'],
    ['cState', 'state'],
    ['cZip', 'zip'],
    ['cBadge', 'badge'],
    ['cAffiliation', 'affiliation'],
    ['cEmployment', 'employment'],
    ['cDiscipline', 'discipline'],
    ['cDiet', 'diet'],
    ['cSheraton', 'sheraton'],
    ['cPoster', 'poster'],
    ['cPayAtMeet', 'payAtMeet'],
    ['cthirdPartyShare', 'thirdPartyShare']
];

const fieldPost = [
    ['cTitle', 'title'],
    ['cAbstract', 'abstract'],
    ['cAuthors', 'authorsAffil']
];

//fillMaps are for autofilling registration page (this for inputs)
const fillMap = [
    ['registeredBy'],
    ['fname'],
    ['lname'],
    ['email'],
    ['country'],
    ['address'],
    ['city'],
    ['state'],
    ['zip'],
    ['badge'],
    ['affiliation'],
    ['employment'],
    ['discipline'],
    ['diet']
]
//fillMaps are for autofilling registration page (this for radio and check buttons)
const fillMap2 = [
    ['sheraton_y', 'sheraton_n', 'sheraton'],
    ['poster_y', 'poster_n', 'poster'],
    ['payAtMeet_y', 'payAtMeet_n', 'payAtMeet'],
    ['thirdPartyShare', 'thirdPartyShare', 'thirdPartyShare']
]

//buttons subjected to showing and hiding in registration.html
const regBttns = [
    ['multiple', 'single'],
    ['singleTitle', 'groupTitle'],
    ['groupTitle', 'singleTitle'],
    ['submitBttn', 'submitBttnNext']
]

//containers subjected to showing and hiding in pay.html
//field is for div containers
//first four are for single selection
//second four are for group selection
const payVarNames = [
    ['earlyStudentPostSelection'],
    ['lateStudentPostSelection'],
    ['earlyProfessionalSelection'],
    ['lateProfessionalSelection'],
    ['earlyStudentPostSelectionGroup'],
    ['lateStudentPostSelectionGroup'],
    ['earlyProfessionalSelectionGroup'],
    ['lateProfessionalSelectionGroup']
]

// ------------SECTION FOR REGISTRATION PAGE------------

//makes sure the user input is correct email format
var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
const validateEmail = (email) => {
    return email.match(validRegex);
};

//clear radio and check buttons (no default buttons selected)
function clearCheckBttns() {
    document.getElementById("regform").reset();
    for (const [field1, field2] of fillMap2) {
        var radio1 = document.getElementById(field1);
        var radio2 = document.getElementById(field2);
        radio1.setAttribute('checked', false);
        radio2.setAttribute('checked', false);
    }
}

//completely clears ALL information if single registrant changes to group or vice versa
function clearAllInfo() {
    //this clearing is if a single registrant decided they wanted to fill out a group registration instead
    clearCheckBttns();
    localStorage.clear();
}

//To switch between single and group registration
function switchReg(bttnId) {

    // shows group registration page
    if (bttnId == 'multiple') {

        //To prompt only once
        if (localStorage.getItem("numReg") == null || localStorage.getItem("numReg") == 0 || localStorage.getItem("regType") == 'single') {
            clearAllInfo();
            numReg = prompt("Please enter the number of the registrants in the box below", 1);
            localStorage.setItem("numReg", numReg);
            localStorage.setItem("regType", "group");
        }

        //get regCount after "clearAllInfo()" has been called (if first time call Group Registration)
        var regNum = parseInt(localStorage.getItem("regCount")) || 0;

        //still more registrants in group registration
        if (regNum + 1 < localStorage.getItem("numReg")) {
            for (const [field1, field2] of regBttns) {
                displayElement(field2, '');
                displayElement(field1, 'none');
            }
        }
        //last registrant in group registration
        else {
            for (const [field1, field2] of regBttns) {
                //make submitButton visible
                if (field2 === 'submitBttnNext') {
                    displayElement(field1, '');
                    displayElement(field2, 'none');
                }
                //everything else invisible
                else {
                    displayElement(field2, '');
                    displayElement(field1, 'none');
                }
            }
            
        }

        //do not exceed numReg for counter
        document.getElementById("count").innerHTML = (regNum + 1 > localStorage.getItem("numReg")) ? regNum : regNum + 1;
        displayElement('counter', '');
    }
    // shows single registration page
    else {
        clearAllInfo();
        localStorage.setItem("regType", "single");
        localStorage.setItem("numReg", 1);
        localStorage.setItem("regCount", 1);
        displayElement('counter', 'none');

        //display specific buttons
        for (const [field1, field2] of regBttns) {
            displayElement(field1, '');
            displayElement(field2, 'none');
        }
    }
}

// If check yes for presenting a poster then go to poster.html
// Else go to confirmation page
function switchWindow(form) {
    var poster_Y = document.getElementById("poster_y");
    if (poster_Y.checked) {
        form.action = "poster.html";
    }
    else {
        form.action = "confirm.html";
    }
    confirmInfo();
}

// ------------SECTION FOR REGISTRATION PAGE ENDED------------



// ------------SECTION FOR POSTER PAGE------------

//transfer user input into json object
// If user forgets or doesn't want to fill out more authors but accidentally clicked
// the "Add Author" button, the blank inputs will not be registered into the JSON object
// nor shown in confirm.hmtl
function confirmPosterInfo(rowIdx) {    
    let a_fname, a_lname, affiliation_Post;

    localStorage.setItem("title", getElemValue("title"));
    localStorage.setItem("abstract", getElemValue("abstract"));
    
    var array = [];
    for (var r = 0, n = rowIdx; r < n; r++) {

        //get values of authors
        a_fname = getElemValue("a_fname" + r);
        a_lname = getElemValue("a_lname" + r);
        affiliation_Post = getElemValue("affiliation_Post" + r);

        //if author section empty, stop loop
        if (a_fname == "" || a_lname == "" || affiliation_Post == "") {
            break;
        }

        //Format author name and affiliation as "firstName lastName (affiliation)"
        localStorage.setItem("aname", a_fname + " " + a_lname);
        let aname = localStorage.getItem("aname");
        array.push(" " + aname + " " + "(" + affiliation_Post + ")");
    }

    //Create JSON object "authors" with array
    for (var i = 0; i < array.length; i++) {
        authorJson = {"authors" : array[i]};
    }
    localStorage.setItem("authorsAffil", JSON.stringify(array));
    // localStorage.setItem("authorsToSubmit", authorJson);
}

//save all poster data and redirects to confirm page
function directTo(form, rowIdx) {
    form.action = "confirm.html";
    confirmPosterInfo(rowIdx);
}

//cancel
function overrideForm() {
    localStorage.setItem("loadData", "true");
    window.location.replace("registration.html");
}

//remove additional authors
function removeAuthor(rowIdx) {
    document.getElementById("R" + rowIdx).remove(rowIdx);
}

// ------------SECTION FOR POSTER PAGE ENDED------------



// ------------SECTION FOR CONFIRM PAGE------------

//puts a registrants information into a json array
function getRegistrants(num) {

    var registrantForm = [];
    let regJson;
    let allJson;
    

    for (const [field1, field2] of fieldMap) {
        regJson = {[field2] : localStorage.getItem(field2)};
        registrantForm.push(regJson);
    }

    // if poster is filled out then it will become visible
    if (localStorage.getItem('poster') === "Yes") {
        for (const [fieldP1, fieldP2] of fieldPost) {
            regJson = {[fieldP2] : localStorage.getItem(fieldP2)};
            registrantForm.push(regJson);
        }
    }
    
    //array put into "registrant" JSON object
    var jsonName = "registrant" + num;
    allJson = {[jsonName] : registrantForm};

    //add to JSON object which contains array of "registrant"
    //first registrant indexed at 0
    if (num == 1) {
        var oldArray = [];
        oldArray[0] = allJson;
    }
    //other registrants indexed at 1+
    else {
        var oldArray = JSON.parse(localStorage.getItem("registrantForms"));
        oldArray[num-1] = allJson;
    }
    //update JSON object with array
    localStorage.setItem("registrantForms", JSON.stringify(oldArray));
}

//counts the number of registrants
//increases everytime user confirms
//only for group registration
function countReg() {
        var confirmReg = parseInt(localStorage.getItem("regCount")) || 0;
        confirmReg = (confirmReg + 1 > localStorage.getItem("numReg")) ? confirmReg : confirmReg = confirmReg + 1; 
        localStorage.setItem("regCount", confirmReg);    
}

// Helper function for confirmationReg()
// Clears specific localStorage in order for next user
// to put in their information
function removeStorage() {
    for (const [field1, field2] of fieldMap) {
        localStorage.removeItem(field2);
    }

    localStorage.removeItem("fname");
    localStorage.removeItem("lname");
    localStorage.removeItem("rowIdx");
    localStorage.removeItem("year");
    
    if (localStorage.getItem('poster') === "Yes") {
        for (const [fieldP1, fieldP2] of fieldPost) {
            localStorage.removeItem(fieldP2);
        }
    }
}

// This function raises registrant counter, puts registrant information into a JSON object, 
// checks to see if there are more registrant forms to fill out in the group
// otherwise goes to pay.html straight away
function confirmationReg() {

    //user has confirmation information, do not load their information in registration
    localStorage.setItem("loadData", false);

    //raise counter
    countReg();
    //store registrant names for pay.html
    getRegNames(localStorage.getItem("regCount"));
    //store registrant information into JSON object
    getRegistrants(localStorage.getItem("regCount"));    

    //if in group registration, remove prev reg info
    if (localStorage.getItem("regType") == "group") {

        //if last reg then go to pay.html
        if (localStorage.getItem("regCount") == localStorage.getItem("numReg")) {
            window.location.href="pay.html";
        }
        //else go back to registration.html
        else {
            removeStorage();
            window.location.href="registration.html";
        }
    }
    //else is a single registrant and go to pay.html
    else {
        window.location.href="pay.html";
    }
}

// This function is to obtain the information to show in the confirmation page
// For now this is called in switchWindow
function confirmInfo() {

    const date = new Date();
    let year = date.getFullYear();
    localStorage.setItem("year", year);

    //inputs
    for (const [field] of fillMap) {
        localStorage.setItem(field, getElemValue(field));
    }
    localStorage.setItem("name", getElemValue("fname") + " " + getElemValue("lname"));

    //radio and check buttons
    for (const [field1, field2, field3] of fillMap2) {
        if (document.getElementById(field1).checked) {
            localStorage.setItem(field3, "Yes");
        }
        else {
            localStorage.setItem(field3, "No");
        }
    }
}

// ------------SECTION FOR CONFIRM PAGE ENDED------------



// ------------SECTION FOR PAY PAGE------------

//collects each registrants first and last name
function getRegNames(num) {

    //if first registrant then put in 0 position of array
    if (num == 1) {
        var oldArray = [];
        oldArray[0] = localStorage.getItem('name');
    }
    //else add to array starting at index 1+
    else {
        var oldArray = JSON.parse(localStorage.getItem("regNames"));
        oldArray[num-1] = localStorage.getItem('name');
    }
    localStorage.setItem("regNames", JSON.stringify(oldArray));
}

//helper method to payPage to list out the registrant names
function showRegNames() {
    //error checker
    if (localStorage.getItem("regNames") != null) {
        var payNames = JSON.parse(localStorage.getItem("regNames"));
        var table = document.getElementById('payTable');

        //add names to table
        //name in new line
        for (var i = 0; i < payNames.length; i++) {
            var row = table.insertRow(i + 1);
            var cell = row.insertCell(0);
            cell.innerHTML = payNames[i];
        }
    }    
}

//For group registrants, gets all registrants information and puts it under
//one JSON object
function submitRegistrants() {
    const reg = {"registrantForms" : JSON.parse(localStorage.getItem("registrantForms"))};
    var forms = JSON.stringify(reg);

    const request = new XMLHttpRequest();

//------------------------------------------------------------------REPLACE: "http://foo.com/submitform.php" with link of choosing-----------------------------------------------------------------
    request.open("POST", "http://foo.com/submitform.php");
    request.send(forms);

    localStorage.clear();
}

//function to show late paypal price options
//instead of the early paypal price options
function checkLatePay(isGroup) {

    const showSelection = [];
    var date = new Date();
    var currDate = date.toLocaleDateString('en-US');

    //--------------------------------------------------------------CHANGE LATE DATE HERE FOR WHICH PRICE SELECTION TO SHOW--------------------------------------------------------------------------
    //change lateDate to the day you want payPal late prices to show
    var lateDate = "2/1/2024";

    //it is the late date
    //put div containers correlated to latedate
    if (currDate >= lateDate) {
        //checks if registration is a group type
        if (isGroup === 'group') {
            showSelection[0] = 'lateStudentPostSelectionGroup';
            showSelection[1] = 'lateProfessionalSelectionGroup';
        }
        else {
            showSelection[0] = 'lateStudentPostSelection';
            showSelection[1] = 'lateProfessionalSelection';
        }
    }
    //late date has NOT passed
    //put early price selection div containers
    else {
        //checks if registration is a group type
        if (isGroup === 'group') {
            showSelection[0] = 'earlyStudentPostSelectionGroup';
            showSelection[1] = 'earlyProfessionalSelectionGroup';
        }
        else {
            showSelection[0] = 'earlyStudentPostSelection';
            showSelection[1] = 'earlyProfessionalSelection';
        }
    }

    return showSelection;

}

//helper method to payPage to disable inputs depending on employment
//hides late paypal price options
function hideInputs(earlyOrLate) {

    //if student then allow student or post doc input
    if (localStorage.getItem("employment") == "student" || localStorage.getItem("employment") == "post-doc") {

        for (const [field] of payVarNames) {
            if (field === earlyOrLate[0]) {
                displayElement(field, '');
            }
            else {
                displayElement(field, 'none');
            }
        }
    }
    // else allow professional input
    else {       
        for (const [field] of payVarNames) {
            if (field === earlyOrLate[1]) {
                displayElement(field, '');
            }
            else {
                displayElement(field, 'none');
            }
        }
    }
}

//helper method to payPage to disable inputs depending on employment
//hides early paypal price options

//hides PayPal button if paying at meeting instead of now
function hidePayPal() {
    payAtMeet = localStorage.getItem("payAtMeet");
    //Do not show paypal button
    if (payAtMeet === "Yes") {
        displayElement('payPalContainer', 'none');
        displayElement('priceSelection', 'none');
        displayElement('paySubmitBttn', '');

    }
    //show paypal button
    else {
        displayElement('paySubmitBttn', 'none');
        hideInputs(checkLatePay(localStorage.getItem("regType")));
    }
}

//shows registrants and hide inputs based on employment
function payPage() {
    showRegNames();
    hidePayPal();
}

function payPalClicked () {
    submitRegistrants();
    localStorage.clear();
}

// ------------SECTION FOR PAY PAGE ENDED------------


// ------------SECTION FOR ALL PAGES------------

function displayElement(id, type) {
    document.getElementById(id).style.display = (type === 'none') ? 'none' : '';
}

function disableInput(id, trueOrFalse) {
    document.getElementById(id).disabled = trueOrFalse;
}

function getElemValue (id) {
    return document.getElementById(id).value;
}

//autofills form if registrants goes back
function loadData() {
    var input;
    if (localStorage.getItem("loadData") === "true") {
        for (const [field] of fillMap) {
            input = document.getElementById(field);
            input.value = localStorage.getItem(field);
        }
        for (const [field1, field2, field3] of fillMap2) {
            if (localStorage.getItem(field3) == "Yes") {
                input = document.getElementById(field1);
                input.setAttribute("checked", true);
            }
            else if (field3 == "thirdPartyShare") {
                input.setAttribute("checked", false);
            }
            else {
                input = document.getElementById(field2);
                input.setAttribute("checked", true);
            }
        }
    }
}

function setLoadData(button, trueOrFalse) {
    //user has not submitted, load their information
    document.getElementById(button).addEventListener("click", function () {
        localStorage.setItem("loadData", trueOrFalse);
    });
}

// ------------SECTION FOR ALL PAGES ENDED------------