// Create New Div
var content = document.getElementById('content');
var div = document.createElement("div");
div.className = "message_board"

var table = document.createElement("table");

// Get info from other pages
nav_list = document.getElementsByClassName("nav-sub")
var subject_list = nav_list[1].children[1].firstElementChild.children[1].children;
for (i = 0; i < subject_list.length; i++) { 
    var site_url = subject_list[i].firstElementChild.href;
	var reuqest = $.ajax({'url': site_url, 'success': function(data) { do_the_work(data, i) }, 'async': false });
}

// Read the pages DOM to get how values and add to the table
function do_the_work(data, i){
	var parser = new DOMParser();
	var doc = parser.parseFromString(data, "text/html");

	// Add row with the info
	var row = table.insertRow(i);
	var cell1 = row.insertCell(0);
	var cell2 = row.insertCell(1);
	var cell3 = row.insertCell(2);
	var cell4 = row.insertCell(3);
	var cell5 = row.insertCell(4);
	cell1.innerHTML = site_url.split("/")[4].replace(/%20/g, " ");
	cell1.className = "left-table";
	cell2.innerHTML = doc.getElementsByClassName("new").length;
	cell3.innerHTML = doc.getElementsByClassName("redo").length;
	cell4.innerHTML = doc.getElementsByClassName("submitted").length;
	cell5.innerHTML = doc.getElementsByClassName("done").length;
}


// Create Table And Column Headers
var header = table.createTHead();
var row = header.insertRow(0);
var h1 = row.insertCell(0);
var h2 = row.insertCell(1);
var h3 = row.insertCell(2);
var h4 = row.insertCell(3);
var h5 = row.insertCell(4);
h1.innerHTML = "Module";
h2.innerHTML = "To Do";
h3.innerHTML = "Redo";
h4.innerHTML = "Submitted";
h5.innerHTML = "Completed";

// Add table to div
div.appendChild(table);
// Add div to DOM
content.insertBefore(div, content.firstChild);
