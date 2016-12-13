/**
 * NEW:
 * - Option to make main site block (everything below the menu) more narrow
 * - Option to remove Toilet button
 * - Table rows are now links to corresponding modules
 * - Modules that done completely (no todo, redo and submitted) are now grey in table
 * 
 * TODO:
 * -[x] do by fetch()
 * -[ ] cache data and update in background
 * -[x] option: page max-width
 * -[x] option: remove toilet button
 */

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
let modules_list = [];  // global array for all excercises
let assigment_list = document.querySelector("#navi-bar > ul > li:nth-child(2) > ul").children;

modules_yet_unprocessed = assigment_list.length; // to count how many async threads already done

for (let assigment of assigment_list) {
    uri = '/rest/course/Assignment?exercise__module__subject__name=' + escape(assigment.children[0].text);
    fetch(uri, {
        credentials: 'include'
    })
        // check response HTTP code
        .then(function (response) {
            if (response.status >= 200 && response.status < 300) {
                return response;
            } else {
                let error = new Error(response.statusText);
                error.response = response;
                throw error;
            }
        })
        .then(function (response) {
            return response.json()
        }).then(function (json) {
            do_the_work(json);
        }).catch(function (ex) {
            console.log('request failed ::', ex);
        })
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
h5.innerHTML = "Done";
tBody = table.createTBody(); // add tbody to table so insertRow append to tbody not thead  


// Add Elements
content.appendChild(div_top);
content.appendChild(to_redo_div);
content.appendChild(todo_div);
div_top.appendChild(table);


/*************** Functions ******************/

function remove_all_assignments() {
    while (content.lastChild) {
        content.removeChild(content.lastChild);
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


// Use JSON to populate the tables
function do_the_work(json) {
    let module_name = json["0"].exercise.module.subject.name;
    let module_url = "/course/status?subject=" + module_name;
    let todo = 0, redo = 0, submitted = 0, done = 0;

    // Go throught current module's json to count different types of excercises
    json.forEach((excercise) => {
        switch (excercise.status) {
            case "New":
                todo++;
                add_assignment("/messages/thread/" + excercise.pk, excercise.description, excercise.exercise.module.subject.name, false);
                break;
            case "Redo":
                redo++;
                add_assignment("/messages/thread/" + excercise.pk, excercise.description, excercise.exercise.module.subject.name, true);
                break;
            case "Submitted":
                submitted++;
                break;
            case "Done":
                done++;
                break;
            default:
                break;
        }
    });

    // Collect array of modules and its values
    // Every element of modules_list[] contains:
    // Name of module
    // URL of module
    // Count of Todo, Redo, Submitted and Done exc.
    modules_list.push([
        [module_name, module_url],
        todo,
        redo,
        submitted,
        done
    ]);

    // Decrement counter of processed modules
    modules_yet_unprocessed--;

    // if all modules already processed, do after-async table filling
    if (modules_yet_unprocessed <= 0) {
        sort_array_and_fill_table_after_async();
    }
}


// Doing after-async table filling to avoid table flickering during loading 
function sort_array_and_fill_table_after_async() {

    // sort array in alphabetical order of modules name
    modules_list.sort((a, b) => {
        return (a[0][1] > b[0][1] ? 1 : -1);
    });

    // fill up every row from array
    modules_list.forEach((current_module) => {
        var row = tBody.insertRow();

        current_module.forEach((value, n) => {
            var cell = row.insertCell();

            if (n == 0) { // if first column
                cell.innerHTML = `<a href="${value[1]}">${value[0]}</a>`;
            } else { // if 'number' columns
                cell.innerHTML = value;
                if (value == 0) cell.className = "zero"; // make zero values grey and non-bold
            }
        });

        // make whole row grey if everything is Done:
        // Todo=0, Redo=0, Submitted=0 and Done>0 
        if (!current_module[1] && !current_module[2] && !current_module[3] && current_module[4]) {
            row.className = "done";
        }
    });
}
