// Kimberly Raymer
// Date 09/18/2023

const fieldMap = [
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
    ['cSheraton', 'sheraton'],
    ['cPosterY_N', 'posterY_N'],
    ['cDiet', 'diet'],
    ['cthirdPartyShare', 'thirdPartyShare']
];

const fieldPost = [
    ['cTitle', 'title'],
    ['cAbstract', 'abstract'],
    ['cAuthors', 'authorsAffil']
    // ['cAffiliation', 'affiliation_Post'],
];



// ------------SECTION FOR REGISTRATION PAGE------------

//To switch between single and group registration
function switchReg(bttnId) {
    var hideBttn;
    var showBttn;
    var hideTitle;
    var showTitle;
    var hideSubmit;
    var showSubmit;

    localStorage.setItem("regType", "single");

    // shows group registration page
    if (bttnId == 'single') {
        //to prompt user about how many registrants
        showBttn = 'multiple';
        hideBttn = 'single';
        showTitle = 'groupTitle';
        hideTitle = 'singleTitle';
        showSubmit = "submitBttn";
        hideSubmit = "submitBttnNext";

        //To prompt only once
        if (localStorage.getItem("numReg") == null || localStorage.getItem("numReg") == 0) {
            numReg = prompt("Please enter the number of the registrants in the box below", 1);
            localStorage.setItem("numReg", numReg);
        }

        //To show next until regCount is equivalent to numReg
        if (localStorage.getItem("regCount") < localStorage.getItem("numReg")) {
            showSubmit = "submitBttnNext";
            hideSubmit = "submitBttn";
            //keeps track of if user clicked group registration
            localStorage.setItem("regType", "group");
        }
        else {
            showSubmit = "submitBttn";
            hideSubmit = "submitBttnNext";
        }

        var regNum = parseInt(localStorage.getItem("regCount")) || 0;
        document.getElementById("count").innerHTML = regNum + 1;

        document.getElementById('counter').style.display = '';
    }
    // shows single registration page
    else {
        localStorage.setItem("regType", "single");
        localStorage.setItem("numReg", 0);
        localStorage.setItem("regCount", 0);
        showBttn = 'single';
        hideBttn = 'multiple';
        showTitle = 'singleTitle';
        hideTitle = 'groupTitle';
        document.getElementById('counter').style.display = 'none';

        showSubmit = "submitBttn";
        hideSubmit = "submitBttnNext";
    }
    document.getElementById(hideBttn).style.display = 'none';
    document.getElementById(showBttn).style.display = '';
    document.getElementById(hideTitle).style.display = 'none';
    document.getElementById(showTitle).style.display = '';
    document.getElementById(hideSubmit).style.display = 'none';
    document.getElementById(showSubmit).style.display = '';
}

// If check yes for presenting a poster then go to poster.html
// Else go to confirmation page
function switchWindow(form) {
    var poster_Y = document.getElementById("poster_y");
    if (poster_Y.checked) {
        form.action = "poster.html";
        confirmInfo();
    }
    else {
        form.action = "confirm.html";
        confirmInfo();
    }
}

// capture what date the registrant filled the form
function generateDate(){
    var currentTime = new Date();                
    var curdate = currentTime.getDate();
    document.getElementbyId("dateHidden").value = curdate;
    return true;
}
// ------------SECTION FOR REGISTRATION PAGE ENDED------------



// ------------SECTION FOR POSTER PAGE------------
//transfer user input into json object
// If user forgets or doesn't want to fill out more authors but accidentally clicked
// the "Add Author" button, the blank inputs will not be registered into the JSON object
// nor shown in confirm.hmtl
function confirmPosterInfo() {    

    let title = document.getElementById("title").value;
    localStorage.setItem("title", title);

    let abstract = document.getElementById("abstract").value;
    localStorage.setItem("abstract", abstract);
    
    var array = [];
    for (var r = 0, n = localStorage.getItem('rowIdx'); r < n; r++) {
        //User did not fill in "add author" (is an empty string)
        //Do not add to list
        if (document.getElementById("a_fname" + r).value == "" || document.getElementById("a_lname" + r).value == "" || document.getElementById("affiliation_Post" + r).value == "") {
            break;
        }

        //Format author name and affiliation as "firstName lastName (affiliation)"
        let a_fname = document.getElementById("a_fname" + r).value;
        let a_lname = document.getElementById("a_lname" + r).value;
        localStorage.setItem("aname", a_fname + " " + a_lname);
        let aname = localStorage.getItem("aname");
        let affiliation_Post = document.getElementById("affiliation_Post" + r).value;
        array.push(" " + aname + " " + "(" + affiliation_Post + ")");
    }

    //Create JSON object "authors" with array
    for (var i = 0; i < array.length; i++) {
        authorJson = {"authors" : array[i]};
    }
    localStorage.setItem("authorsAffil", JSON.stringify(array));
    localStorage.setItem("authorsToSubmit", authorJson);
}

//save all poster data and redirects to confirm page
function directTo(form) {
    form.action = "confirm.html";
    confirmPosterInfo();
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
    if (localStorage.getItem('posterY_N').match("Yes")) {
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

//For group registrants, gets all registrants information and puts it under
//one JSON object
function submitRegistrants() {
    const reg = {"registrantForms" : JSON.parse(localStorage.getItem("registrantForms"))};
    var forms = JSON.stringify(reg);

    const request = new XMLHttpRequest();

//REPLACE: "http://foo.com/submitform.php" with link of choosing
    request.open("POST", "http://foo.com/submitform.php");
    request.send(forms);
}

//counts the number of registrants
//increases everytime user confirms
//only for group registration
function countReg() {
        var confirmReg = parseInt(localStorage.getItem("regCount")) || 0;

        confirmReg = confirmReg + 1; 
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
    
    if (localStorage.getItem('posterY_N') === "Yes") {
        for (const [fieldP1, fieldP2] of fieldPost) {
            localStorage.removeItem(fieldP2);
        }
    }
}

// This function raises registrant counter, puts registrant information into a JSON object, 
// checks to see if there are more registrant forms to fill out in the group
// otherwise goes to pay.html straight away
function confirmationReg() {

    //raise counter
    countReg();
    //store registrant names for pay.html
    groupRegNames(localStorage.getItem("regCount"));
    //store registrant information into JSON object
    getRegistrants(localStorage.getItem("regCount"));

    // if it is last member of group registrants
    //then remove storage pertaining to previous user
    if (localStorage.getItem("regType") == "group") {
        removeStorage();

        //if last reg then go to pay.html
        if (localStorage.getItem("regCount") == localStorage.getItem("numReg")) {
            window.location.href="pay.html";
        }
        //else go back to registration.html
        else {
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

    let fname = document.getElementById("fname").value;
    localStorage.setItem("fname", fname);

    let lname = document.getElementById("lname").value;
    localStorage.setItem("lname", lname);
    localStorage.setItem("name", fname + " " + lname);

    let email = document.getElementById("email").value;
    localStorage.setItem("email", email);

    let country = document.getElementById("country").value;
    localStorage.setItem("country", country);

    let address = document.getElementById("address").value;
    localStorage.setItem("address", address);

    let city = document.getElementById("city").value;
    localStorage.setItem("city", city);

    let state = document.getElementById("state").value;
    localStorage.setItem("state", state);

    let zip = document.getElementById("zip").value;
    localStorage.setItem("zip", zip);

    let badge = document.getElementById("badge").value;
    localStorage.setItem("badge", badge);

    let affiliation = document.getElementById("affiliation").value;
    localStorage.setItem("affiliation", affiliation);

    let employment = document.getElementById("employment").value;
    localStorage.setItem("employment", employment);

    let discipline = document.getElementById("discipline").value;
    localStorage.setItem("discipline", discipline);


    if (document.getElementById("sheraton_y").checked) {
        let shearton = "Yes";
        localStorage.setItem("sheraton", shearton);
    }
    else if (document.getElementById("sheraton_n").checked) {
        let shearton = "No";
        localStorage.setItem("sheraton", shearton);
    }

    if (document.getElementById("poster_y").checked) {
        let posterY_N = "Yes";
        localStorage.setItem("posterY_N", posterY_N);
    }
    else if (document.getElementById("poster_n").checked) {
        let posterY_N = "No";
        localStorage.setItem("posterY_N", posterY_N);
    }

    let diet = document.getElementById("diet").value;
    localStorage.setItem("diet", diet);

    if (document.getElementById("thirdPartyShare").checked) {
        let thirdPartyShare = "Yes";
        localStorage.setItem("thirdPartyShare", thirdPartyShare);
    }
    else if (document.getElementById("thirdPartyShare").checked == false) {
        let thirdPartyShare = "No";
        localStorage.setItem("thirdPartyShare", thirdPartyShare);
    }
}

// ------------SECTION FOR CONFIRM PAGE ENDED------------



// ------------SECTION FOR PAY PAGE------------

//collects each registrants first and last name
function groupRegNames(num) {

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

//shows registrants and clears localStorage
function payPage() {

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

    //ALL localStorage cleared
    //Reset webpage
    localStorage.clear();
}

// ------------SECTION FOR PAY PAGE ENDED------------


















