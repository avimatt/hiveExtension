// Get the main div of the page and clear it
var content = document.getElementById('content');
remove_all_assignments();

// Create Div for table
var div_top = document.createElement("div");
var table = document.createElement("table");
div_top.className = "message_board"
div_top.appendChild(table);

// Create the To Redo Section
var to_redo_div = document.createElement("div")
var title_redo = document.createElement("h2");
title_redo.innerHTML = "Assignments To Redo";
to_redo_div.appendChild(title_redo);

// Create the To Do Section
var todo_div = document.createElement("div")
var title_todo = document.createElement("h2");
title_todo.innerHTML = "Assignments To Do";
todo_div.appendChild(title_todo);

// Get info from other pages
nav_list = document.getElementsByClassName("nav-sub")
var subject_list = nav_list[1].children[1].firstElementChild.children[1].children;
for (i = 0; i < subject_list.length; i++) { 
    var site_url = subject_list[i].firstElementChild.href;
	var request = $.ajax({'url': site_url, 'success': function(data) { do_the_work(data, i) }, 'async': false });
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

// Add Elements
content.appendChild(div_top);
content.appendChild(to_redo_div);
content.appendChild(todo_div);

/*************** Functions ******************/

function remove_all_assignments(){
	while(content.children.length > 0){
		content.removeChild(content.firstElementChild);
	}
}

// Create a content box and add it to the dom
function add_assignment(href, name, module, redo_flag) {
	// Create Elements
	div = document.createElement("div");
	a = document.createElement("a");
	h3 = document.createElement("h3");
	//p = document.createElement("p");

	// Populate Elements
	div.className = "message_board";
	a.href = href;
	ass_name = "Assignment: " + name;
	h3.innerHTML = ass_name + "(" + module + ")";
	//p.innerHTML = "Your Assignment, " + name + " in " + module + " needs to be completed";

	// Add elemnts to the DOM
	a.appendChild(h3);
	div.appendChild(a);
	//div.appendChild(p);
	redo_flag ? to_redo_div.appendChild(div) : todo_div.appendChild(div);
}

// Read the pages DOM to get how values and add to the table
function do_the_work(data, i){
	var module_name = site_url.split("/")[4].replace(/%20/g, " ");
	var parser = new DOMParser();
	var doc = parser.parseFromString(data, "text/html");

	// Add content boxes for tasks that aren't done
	var todo = doc.getElementsByClassName("new");
	for(j = 0; j < todo.length; j++){
		href = todo[j].outerHTML.match(/".*?"/)[0].replace(/\"/g, "");
		add_assignment(href, todo[j].innerHTML, module_name, false);
	}

	// Add content boxes for tasks that aren't done
	var redo = doc.getElementsByClassName("redo");
	for(j = 0; j < redo.length; j++){
		href = redo[j].outerHTML.match(/".*?"/)[0].replace(/\"/g, "");
		add_assignment(href, redo[j].innerHTML, module_name, true);
	}

	// Add row with the info
	var row = table.insertRow(i);
	var cell1 = row.insertCell(0);
	var cell2 = row.insertCell(1);
	var cell3 = row.insertCell(2);
	var cell4 = row.insertCell(3);
	var cell5 = row.insertCell(4);
	cell1.innerHTML = module_name
	cell1.className = "left-table";
	cell2.innerHTML = todo.length;
	cell3.innerHTML = redo.length;
	cell4.innerHTML = doc.getElementsByClassName("submitted").length;
	cell5.innerHTML = doc.getElementsByClassName("done").length;
}
