var x = new Date();
var addedDate = false;
var form = false;
var chart = false;
window.addEventListener("pageshow", mainFunction);
var savedDate;
function mainFunction() {
    if (addedDate == false) {
        createCalendar();
    }
    if (form == false) {
        secondView();
    }
    if (chart == true){
        showChart();
    }
}
//Restars everything
function addOtherDate(){
    addedDate = false;
    form = false;
    chart = false;
    document.getElementById("content").innerHTML = "";
    document.getElementById("footer").innerHTML = "";
    mainFunction();
}
//Create line chart
function showChart() {
    document.getElementById("content").innerHTML = "";
    document.getElementById("heading").innerHTML = "Burned calories per day";
    var returnButton = document.createElement("button");
    returnButton.innerHTML = "Add another day";
    returnButton.onclick = addOtherDate;
    document.getElementById("footer").appendChild(returnButton);
    //Chart
    document.getElementById("content").style.backgroundColor = "white";
    var canvas = document.createElement("canvas");
    canvas.setAttribute("id", "myChart");
    canvas.width = 400;
    canvas.height = 200;
    document.getElementById("content").appendChild(canvas);
    //Create dictionary of dates
    var data = addDates();
    //Get local data and send ready dictionary
    function addDates() {
        var localArchive = {};
        var keys = Object.keys(localStorage);
        var i = keys.length;
        while (i--) {
            localArchive[keys[i]] = localStorage.getItem(keys[i]);
        }
        var paivat = getDays(localArchive);
        return paivat;
    }
    //Formate dictionary
    function getDays(dict) {
        var returnList = { values: [] };
        var calList = {};
        for (var keys in dict) {
            if (keys.indexOf(".") > 0) {
                var key = keys.split(".");
                if (!(key[0] in calList)) {
                    calList[key[0]] = 0;
                }
                var aCoeff = getCoaff(key[1]);
                function getCoaff(k){
                    if (k=="run"){
                        return 557;
                    } else if (k == "walk"){
                        return 210;
                    } else if (k == "sleep"){
                        return 50;
                    }
                };
                calList[key[0]] += (parseInt(dict[keys])*aCoeff);
            }
        }
        for (var keys in dict) {
            if (keys.indexOf(".") < 0) {
                var date =
                    returnList.values.push({ X: keys, Y: calList[keys]});
            }
        }
        return returnList;
    }
    //Create line chart
    var graph;
    var xPadding = 40;
    var yPadding = 30;
    //Get max value from dictionary
    function getMaxY() {
        var max = 0;
        for (var i = 0; i < data.values.length; i++) {
            if (data.values[i].Y > max) {
                max = data.values[i].Y;
            }
        }
        max += 10 - max % 10;
        return max;
    }
    function getXPixel(val) {
        return ((graph.width - xPadding) / data.values.length) * val + (xPadding * 1.5);
    }
    function getYPixel(val) {
        return graph.height - (((graph.height - yPadding) / getMaxY()) * val) - yPadding;
    }
    //Create the chart
    funktio();
    function funktio() {
        graph = document.getElementById("myChart");
        var c = graph.getContext('2d');
        c.lineWidth = 2;
        c.strokeStyle = '#333';
        c.font = 'italic 8pt sans-serif';
        c.textAlign = "center"
        c.beginPath();
        c.moveTo(xPadding, 0);
        c.lineTo(xPadding, graph.height - yPadding);
        c.lineTo(graph.width, graph.height - yPadding);
        c.stroke();
        for (var i = 0; i < data.values.length; i++) {
            c.fillText(data.values[i].X, getXPixel(i), graph.height - yPadding + 20);
        }
        c.textAlign = "right"
        c.textBaseline = "middle";

        for (var i = 0; i < getMaxY(); i += 500) {
            c.fillText(i, xPadding - 10, getYPixel(i));
        }
        c.strokeStyle = '#f00';
        c.beginPath();
        c.moveTo(getXPixel(0), getYPixel(data.values[0].Y));

        for (var i = 1; i < data.values.length; i++) {
            c.lineTo(getXPixel(i), getYPixel(data.values[i].Y));
        }
        c.stroke();
    }
}
//The form submition function
function sendData() {
    localStorage.setItem(savedDate + ".run", document.getElementById("input1").value);
    localStorage.setItem(savedDate + ".walk", document.getElementById("input2").value);
    localStorage.setItem(savedDate + ".sleep", document.getElementById("input3").value);
    form = true;
    chart = true;
    mainFunction();
}
// The function creates form-element
function secondView() {
    document.getElementById("content").innerHTML = "";
    //Create heading
    document.getElementById("heading").innerHTML = "Fufill the form";
    //Create Form-element
    const content = document.getElementById("content");
    const form = document.createElement("form");
    form.setAttribute("id", "form");
    content.appendChild(form);
    //Create run-input
    var div1 = document.createElement("div");
    var input1 = document.createElement("input");
    input1.setAttribute("id", "input1");
    var i1l = document.createElement("label");
    i1l.setAttribute("for", "input1");
    i1l.innerHTML = "How many kilometers you did run?";
    div1.appendChild(i1l);
    input1.setAttribute("type", "number");
    input1.setAttribute("placeholder", "kilometers");
    div1.appendChild(input1);
    form.appendChild(div1);
    //Create walk-input
    var div2 = document.createElement("div");
    var input2 = document.createElement("input");
    input2.setAttribute("id", "input2");
    var i2l = document.createElement("label");
    i2l.setAttribute("for", "input2");
    i2l.innerHTML = "How many kilometers you did walk?";
    div2.appendChild(i2l);
    input2.setAttribute("type", "number");
    input2.setAttribute("placeholder", "kilometers");
    div2.appendChild(input2);
    form.appendChild(div2);
    //Create run-input
    var div3 = document.createElement("div");
    var input3 = document.createElement("input");
    input3.setAttribute("id", "input3");
    var i3l = document.createElement("label");
    i3l.setAttribute("for", "input3");
    i3l.innerHTML = "How many hours you have slept?";
    div3.appendChild(i3l);
    input3.setAttribute("type", "number");
    input3.setAttribute("placeholder", "hours");
    div3.appendChild(input3);
    form.appendChild(div3);
    //Create submit
    var div4 = document.createElement("div");
    var subm = document.createElement("input");
    subm.setAttribute("type", "submit");
    subm.setAttribute("value", "Send data");
    subm.onclick = sendData;
    div4.appendChild(subm);
    form.appendChild(div4);
}
// Adding date to local storage and moving to the next form
function nextView(e) {
    var target = e.target;
    var day = target.innerText;
    if (parseInt(day) < 10) {
        day = "0" + day;
    }
    var year = x.getFullYear().toString();
    var month = x.getMonth() + 1;
    if (month < 10) {
        month = "0" + (month.toString());
    }
    var date = year + month + day;
    localStorage.setItem(date, date);
    savedDate = date;
    addedDate = true;
    mainFunction();
}
//At first creating callendar and then dislayin dates
function createCalendar() {
    addCalendar();
    displayDates();
}
//Function display's months and dates and creates buttons from dates
function displayDates() {
    //Display right year
    var year = x.getFullYear();
    document.getElementById("thisYear").innerText = year;
    //Display right month
    const months = {
        0: "January", 1: "February", 2: "March", 3: "April", 4: "May", 5: "June", 6: "July",
        7: "August", 8: "September", 9: "October", 10: "November", 11: "December"
    };
    var idmonth = document.getElementById("month");
    var month = x.getMonth();
    idmonth.innerText = months[month];
    idmonth.style.fontSize = "20px";
    idmonth.style.letterSpacing = "3px";
    idmonth.style.textTransform = "uppercase";
    //Create days for display
    const dNumb = [];
    var ul = document.getElementById("days");
    var lom = { 0: 31, 1: 28, 2: 31, 3: 30, 4: 31, 5: 30, 6: 31, 7: 31, 8: 30, 9: 31, 10: 30, 11: 31 };
    var ulSize = ul.getElementsByTagName("li").length;
    var leapYear = getLeapYear(year);
    if (leapYear == true) {
        lom[1] = 29;
    }
    //Add days to calendar
    if (ulSize != 0) {
        ul.innerHTML = '';
    }
    var dim = lom[month];
    const rightDate = new Date(year, month, 1);
    for (let i = 1; i <= dim; i++) {
        dNumb.push(i);
    }
    if (rightDate.getDay() != 1) {
        if (rightDate.getDay() == 0) {
            for (var i = 0; i < 6; i++) {
                dNumb.unshift("");
            }
        } else {
            for (var i = 0; i < (rightDate.getDay() - 1); i++) {
                dNumb.unshift("");
            }
        }
    }
    for (let i = 0; i < dNumb.length; i++) {
        var li = document.createElement("li");
        var btn = document.createElement("button");
        btn.innerHTML = dNumb[i];
        btn.onclick = nextView;
        li.appendChild(btn);
        ul.appendChild(li);
    }
    //Display today
    const dayslist = ul.getElementsByTagName('li');
    for (var i = 0; i <= dayslist.length; i++) {
        if (dayslist[i].innerText == (x.getDate())) {
            dayslist[i].style.backgroundColor = "#1abc9cd6";
        }
    }
}
//Function returns leap year information
function getLeapYear(year) {
    if ((year % 4 == 0) && (year % 100 != 0) || (year % 400 == 0)) {
        return true;
    } else {
        return false;
    }
}
//Changes the calendar by showing previous month
function prevDate() {
    var year = x.getFullYear();
    var month = x.getMonth();
    if (month == 0) {
        month = 12;
        year -= 1;
    }
    x = new Date(year, (month - 1));
    displayDates();
}
//Changes the calendar by showing next month
function nextDate() {
    var year = x.getFullYear();
    var month = x.getMonth();
    if (month == 12) {
        month = 0;
        year += 1;
    }
    x = new Date(year, (month + 1), 1);
    displayDates();
}
//Create callendar
function addCalendar() {
    //Create heading
    document.getElementById("heading").innerHTML = "Select the date of activity";
    //Create navigation of calendar
    var ul1 = document.createElement("ul");
    var bp = document.createElement("button");
    bp.setAttribute("id", "prev");
    bp.onclick = prevDate;
    bp.innerHTML = "&#10094;";
    var bn = document.createElement("button");
    bn.setAttribute("id", "next");
    bn.innerHTML = "&#10095;";
    bn.onclick = nextDate;
    var mli = document.createElement("li");
    mli.setAttribute("id", "month");
    var yli = document.createElement("li");
    yli.setAttribute("id", "thisYear");
    ul1.appendChild(bp);
    ul1.appendChild(bn);
    ul1.appendChild(mli);
    ul1.appendChild(yli);
    // Create content, weekdays
    var ul2 = document.createElement("ul");
    ul2.setAttribute("class", "weekdays");
    ul2.setAttribute("id", "weekdays");
    var u2l1 = document.createElement("li");
    var u2l1t = document.createTextNode("Mo");
    u2l1.appendChild(u2l1t);
    var u2l2 = document.createElement("li");
    var u2l2t = document.createTextNode("Tu");
    u2l2.appendChild(u2l2t);
    var u2l3 = document.createElement("li");
    var u2l3t = document.createTextNode("We");
    u2l3.appendChild(u2l3t);
    var u2l4 = document.createElement("li");
    var u2l4t = document.createTextNode("Th");
    u2l4.appendChild(u2l4t);
    var u2l5 = document.createElement("li");
    var u2l5t = document.createTextNode("Fr");
    u2l5.appendChild(u2l5t);
    var u2l6 = document.createElement("li");
    var u2l6t = document.createTextNode("Sa");
    u2l6.appendChild(u2l6t);
    var u2l7 = document.createElement("li");
    var u2l7t = document.createTextNode("Su");
    u2l7.appendChild(u2l7t);
    ul2.appendChild(u2l1);
    ul2.appendChild(u2l2);
    ul2.appendChild(u2l3);
    ul2.appendChild(u2l4);
    ul2.appendChild(u2l5);
    ul2.appendChild(u2l6);
    ul2.appendChild(u2l7);
    var ul3 = document.createElement("ul");
    ul3.setAttribute("class", "days");
    ul3.setAttribute("id", "days");
    document.getElementById("content").appendChild(ul1);
    document.getElementById("content").appendChild(ul2);
    document.getElementById("content").appendChild(ul3);
}
