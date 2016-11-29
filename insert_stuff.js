// Get the main div of the page and clear it
var content = document.getElementById('content');
remove_all_assignments();

// Create Div for table
var div_top = document.createElement("div");
var table = document.createElement("table");
div_top.className = "message_board";

// Create the To Redo Section
var to_redo_div = document.createElement("div");
var title_redo = document.createElement("h2");
title_redo.innerHTML = "Assignments To Redo";
to_redo_div.appendChild(title_redo);

// Create the To Do Section
var todo_div = document.createElement("div")
var title_todo = document.createElement("h2");
title_todo.innerHTML = "Assignments To Do";
todo_div.appendChild(title_todo);

// Get info from other pages
nav_list = document.getElementsByClassName("nav-sub");
let subjects_list = [];
var subject_list = nav_list[1].children[1].firstElementChild.children[1].children;
subjects_processing_countdown = subject_list.length;
for (let i = 0; i < subject_list.length; i++) {
    let site_url = subject_list[i].firstElementChild.href;
    var request = $.ajax({
        'url': site_url,
        'success': function(data) {
            do_the_work(data, site_url, i);
        },
        'async': true
    });
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
tBody = table.createTBody();

// Add Elements
content.appendChild(div_top);
content.appendChild(to_redo_div);
content.appendChild(todo_div);
div_top.appendChild(table);
/*************** Functions ******************/

function remove_all_assignments() {
    while (content.children.length > 0) {
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
function do_the_work(data, site_url, i) {
    var module_name = site_url.split("/")[4].replace(/%20/g, " ");
    var parser = new DOMParser();
    var doc = parser.parseFromString(data, "text/html");

    // Add content boxes for tasks that aren't done
    var todo = doc.getElementsByClassName("new");
    for (j = 0; j < todo.length; j++) {
        href = todo[j].outerHTML.match(/".*?"/)[0].replace(/\"/g, "");
        add_assignment(href, todo[j].innerHTML, module_name, false);
    }

    // Add content boxes for tasks that aren't done
    var redo = doc.getElementsByClassName("redo");
    for (j = 0; j < redo.length; j++) {
        href = redo[j].outerHTML.match(/".*?"/)[0].replace(/\"/g, "");
        add_assignment(href, redo[j].innerHTML, module_name, true);
    }

    subjects_list.push(
        [[module_name, site_url],
        todo.length,
        redo.length,
        doc.getElementsByClassName("submitted").length,
        doc.getElementsByClassName("done").length]
    );

    // subjects_list.push({
    //     "module_name": module_name,
    //     "site_url": site_url,
    //     "todo": todo.length,
    //     "redo": redo.length,
    //     "submitted": doc.getElementsByClassName("submitted").length,
    //     "done": doc.getElementsByClassName("done").length
    // });

    subjects_processing_countdown--;

    if (subjects_processing_countdown <= 0) {
        subjects_list.sort((a, b) => {
            return (a[0][1] > b[0][1] ? 1 : -1);
        })
        // console.log(subjects_list);
        subjects_list.forEach((e) => {
            var row = tBody.insertRow();
            e.forEach((el, n) => {
				// console.log(n, el);
                var cell = row.insertCell();
                if (n == 0) {
					// console.log(el[0], el[1]);
                    cell.innerHTML =  `<a href="${el[1]}">${el[0]}</a>`;
                } else {
                    cell.innerHTML = el;
					if (el == 0) {cell.className = "zero";}

                }
            });



            // var row = tBody.insertRow();
            // var cell1 = row.insertCell(0);
            // var cell2 = row.insertCell(1);
            // var cell3 = row.insertCell(2);
            // var cell4 = row.insertCell(3);
            // var cell5 = row.insertCell(4);
            // cell1.innerHTML = `<a href="${el.site_url}">${el.module_name}</a>`;

            // if (!el.todo) { cell2.className = "zero" };
            // if (!el.redo) { cell3.className = "zero" };
            // if (!el.submitted) { cell4.className = "zero" };
            // if (!el.done) { cell5.className = "zero" };
            // cell2.innerHTML = el.todo;
            // cell3.innerHTML = el.redo;
            // cell4.innerHTML = el.submitted;
            // cell5.innerHTML = el.done;
        });
        document.querySelector('.message_board').style.height = 'auto';
    }

    /*
        // Add row with the info
        
    */

}
