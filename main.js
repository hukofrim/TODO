// Query selectors
const newProjectWindow = document.querySelector("#newProjectPopup");
const newTaskWindow = document.querySelector("#newTaskPopup");
const newProjectButton = document.querySelector("#newProjectButton");
const overlay = document.querySelector("#overlay");
const submitNewProject = document.querySelector("#newProjectPopup button");
const addNewTask = document.querySelector("#newTaskPopup button");
const closeButtons = document.querySelectorAll(".close");
const projectName = document.querySelector("#projectName");
const projectTask = document.querySelector("#projectTask");
const dateStarted = document.querySelector("#dateStarted");
const newTaskField = document.querySelector("#newTask");
const tbody = document.querySelector('tbody');

// Back-end stuff
let projects = [];
let highestKey = 0; // TODO: onload, update highestKey based on the last item on project list
let openedSidePopup; // tracks the current open side popup. Only 1 can be open at a time
let newTaskTarget; // tracks which project is currently being accessed by the task addition functions

class Project {
    constructor(name, taskList, startDate) {
        this.name = name;
        this.tasks = taskList;
        this.startDate = startDate;
        this.key = highestKey + 1;
        
        this.lastFinished = null; // When loading from db, assign this directly after the constructor
    }
}

function updateHighestKey() {
    for (const project of projects) {
        if (project.key > highestKey) {
            highestKey = project.key;
        };
    };
}

function returnObj(objName, list) {
    // Get the object from list that matches objName
    const obj = list.find((object) => {
        return object.name === objName;
    });
    return obj;
}

function finishTask(e) {
    const currentRow = e.currentTarget.closest('tr');
    const projectName = currentRow.querySelector('.projectName').textContent;

    const project = returnObj(projectName, projects);

    if (project.tasks.length > 0) {
        project.lastFinished = project.tasks.shift();
        updateRow(currentRow, project);
        updateInDB(project);
        console.log(`"${project.lastFinished}" moved to Last Finished.`);
    }
    else {
        console.log(`No task available.`)
    }
}

function deleteTask(e) {
    // Get the project row and name
    const currentRow = e.target.parentElement.parentElement.parentElement.closest('tr');
    const projectName = currentRow.querySelector('.projectName').textContent;

    // Get the specific task row and name to be deleted
    const currentTaskRow = e.target.closest('tr')
    const taskName = currentTaskRow.querySelector('td.taskName').textContent; 

    // Get the actual project object and find the index of our target task in its tasklist
    const project = returnObj(projectName, projects);
    const taskIndex = project.tasks.indexOf(taskName);
    
    // If task is found, remove it at its index, update the prject row,  update in db, and log
    if (taskIndex > -1) {
        project.tasks.splice(taskIndex, 1);
        updateRow(currentRow, project);
        updateInDB(project);
        console.log(`"${taskName}" task deleted.`);
    }
    else {
        console.log(`"${taskName}" not found.`);
    }
}

addNewTask.addEventListener('click', () => {
    const currentRow = document.querySelector('.projectName#' + newTaskTarget.name.replace(" ", "")).closest('tr');
    
    newTaskField.focus();
    if (newTaskField.value) {
        newTaskTarget.tasks.push(newTaskField.value);
        updateRow(currentRow, newTaskTarget);
        updateInDB(newTaskTarget);
        newTaskField.value = null;
    }  
})

// General pop up functions
for (const button of closeButtons) {
    button.addEventListener('click', closePopup);
}


function closePopup(e) {
    const popup = e.target.closest(".popup");

    const isHidden = getComputedStyle(popup).display === 'none';
    const overlaid = getComputedStyle(popup).display === 'block';

    if (!isHidden) {
        popup.style.display = 'none';
    }
    if (overlaid) {
        overlay.style.display = 'none';
    }
}

function openTaskPopup(e) {
    // currenTarget is td element with children [span, div]
    const popup = e.currentTarget.querySelector('.popup');

    if (e.target !== e.currentTarget && e.target !== e.currentTarget.querySelector('span')) { // currentTarget is the element where the listener is attached to. target is the element that triggered the event
        return; // AKA proceed only if the td and span is clicked, not the actual popup
    }

    const isHidden = getComputedStyle(popup).display === 'none';

    if (isHidden) {
        popup.style.display = 'block';
        if (openedSidePopup && openedSidePopup !== popup) {
            openedSidePopup.style.display = 'none';
        }
        openedSidePopup = popup;
    }
    else {
        popup.style.display = 'none';
    }
}

function listTask(project) {
    const table = document.createElement('table');
    table.setAttribute('class', 'body')
    for (const task of project.tasks) {
        const tr = document.createElement('tr');
        const moveToTop = document.createElement('td');
            const topButton = document.createElement('img');
        const moveUp = document.createElement('td');
            const upButton = document.createElement('img');
        const delTask = document.createElement('td');
            const delTaskButton = document.createElement('img');
        const taskTitle = document.createElement('td');
        
        topButton.setAttribute('class', 'icon top');
        topButton.setAttribute('src', 'images/top.svg');
        topButton.addEventListener('click', moveToTop); //function does not exist
        moveToTop.appendChild(topButton);

        upButton.setAttribute('class', 'icon up');
        upButton.setAttribute('src', 'images/up.svg');
        upButton.addEventListener('click', moveUp); //function does not exist
        moveUp.appendChild(upButton);

        delTaskButton.setAttribute('class', 'icon delTask');
        delTaskButton.setAttribute('src', 'images/delete.svg');
        delTaskButton.addEventListener('click', deleteTask);
        delTask.appendChild(delTaskButton);

        taskTitle.textContent = task;
        taskTitle.setAttribute('class', 'taskName');

        tr.appendChild(moveToTop);
        tr.appendChild(moveUp);
        tr.appendChild(delTask);
        tr.appendChild(taskTitle);
        table.appendChild(tr);
    }

    return table;
}

// New Project or Task
newProjectButton.addEventListener('click', () => {
    openWindowPopup(newProjectWindow);
});
submitNewProject.addEventListener('click', newProject);

function openWindowPopup(selector) {
    const isHidden = getComputedStyle(selector).display === 'none';

    if (isHidden) {
        selector.style.display = 'block';
        overlay.style.display = 'block';
    }
    else {
        selector.style.display = 'none';
        overlay.style.display = 'none';
    }
}


function newProject(e) {
    e.preventDefault()
    
    // Validate form inputs
    if (projectName.value && projectTask.value && dateStarted.value) {
        const project = new Project(projectName.value, [projectTask.value], dateStarted.value);
        console.log(`Created new project: ${projectName.value}`);
        highestKey++;
        console.log(`Next key: ${highestKey}`)
        projects.push(project);

        // close popup window and overlay
        newProjectWindow.style.display = 'none';
        overlay.style.display = 'none';
        projectName.value = null;
        projectTask.value = null;
        dateStarted.value = null;

        // Reload table to reflect new project
        createNewRow(project);

        // Save to db
        addToDB(project);
    }
    else {
        alert("Make sure all input fields have a value.")
    }
}

// Table loading functions

function reloadTable() {
    clearTable();
    for (const project of projects) {
        createNewRow(project);
    }
    console.log(`Table reloaded`);
}

function updateRow(row, project) {
    row.querySelector('.projectName').textContent = project.name;
    row.querySelector('.lastFinished').textContent = project.lastFinished;
    if (project.tasks[0]) {
        row.querySelector('.current span').textContent = project.tasks[0];    
    }
    else {
        row.querySelector('.current span').textContent = 'Add task...';
    }
    let body = row.querySelector('.current .popup .body');
    row.querySelector('.popup').removeChild(body);
    body = listTask(project);
    row.querySelector('.popup').insertBefore(body, row.querySelector('.popup').children[1]);
}

function createNewRow(project) {
    const row = document.createElement('tr');
    const name = document.createElement('td');
    const lastFinished = document.createElement('td');
    const currentTask = document.createElement('td');
        // currentTask children
        const taskName = document.createElement('span');
        const sidePopup = document.createElement('div');
            // Popup
            const header = document.createElement('div');
            const title = document.createElement('h3');
            const closeButton = document.createElement('img');
            const footer = document.createElement('div');
            const addTaskButton = document.createElement('button');
    const finishButton = document.createElement('td');
        const icon = document.createElement('img');

    name.textContent = project.name;
    name.setAttribute('class', 'projectName');
    name.setAttribute('id', project.name.replace(" ", ""));
    lastFinished.textContent = project.lastFinished;
    lastFinished.setAttribute('class', 'lastFinished');
    currentTask.setAttribute('class', 'current');
    currentTask.addEventListener('click', openTaskPopup);
    
        taskName.textContent = project.tasks[0];
        taskName.setAttribute('class', 'button');

        // popup construction
        sidePopup.setAttribute('class', 'popup side');
            header.setAttribute('class', 'header');
            title.textContent = `${project.name}: Tasks`;
            closeButton.setAttribute('class', 'icon close');
            closeButton.setAttribute('src', 'images/close-svgrepo-com.svg');
            closeButton.addEventListener('click', closePopup);
            header.appendChild(title);
            header.appendChild(closeButton);

            const body = listTask(project);

            footer.setAttribute('class', 'footer');
            addTaskButton.textContent = '+';
            addTaskButton.setAttribute('class', 'newTaskButton');
            addTaskButton.addEventListener('click', () => {
                newTaskField.value = null;
                openWindowPopup(newTaskWindow);
                newTaskTarget = project;
                newTaskField.focus();
            });
            footer.appendChild(addTaskButton);
        sidePopup.appendChild(header);
        sidePopup.appendChild(body);
        sidePopup.appendChild(footer);
    
    icon.setAttribute('class', 'icon check');
    icon.setAttribute('src', 'images/check.svg');
    icon.addEventListener('click', finishTask);
    finishButton.appendChild(icon);
    finishButton.setAttribute('class', 'finishTaskButtons')

    currentTask.appendChild(taskName);
    currentTask.appendChild(sidePopup);
    row.appendChild(name);
    row.appendChild(lastFinished);
    row.appendChild(currentTask);
    row.appendChild(finishButton);
    tbody.appendChild(row);

    console.log(`Project ${project.name} added to table`);
}

function clearTable() {
    while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
    }
    console.log('Removed all table contents.')
}


// testing for onload function (ez took me about 5 minutes lol. Thank you past me for creating modular functions)
let temp = new Project('CS50', ['Finish final project', 'Create README file', 'Video'], Date('01/20/2024'));
highestKey++;
projects.push(temp);

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded and parsed");
    reloadTable();
});

// IDB stuff
// Initialize db in a global var
let db;

openDb(() => retrieveFromDb((list) => { // Google callback functions if you can't remember what this does
    projects = list;
    updateHighestKey();
    reloadTable();
}));

function openDb(callback) {
    const request = window.indexedDB.open("projectDatabase", 1);
    
    request.onerror = (e) => {
        console.log('Error opening DB')
    };
    
    request.onsuccess = (e) => {
        db = e.target.result;
        console.log('DB opened');
        db.onerror = (e) => {
            console.error(`Database error: ${e.target.errorCode}`);
        }
        callback();
    };

    // the actual meat of the function that creates object stores
    request.onupgradeneeded = (e) => {
        db = e.target.result;
        const projectStore = db.createObjectStore('projects', {keyPath: 'key'});
        console.log('DB created');
        const index = projectStore.createIndex('nameIndex', 'name', {unique: false});
    };
}

function retrieveFromDb(handler) {
    console.log('Retreiving data from db...')
    if (!db) {
        console.log('No opened DB.');
        return;
    };
    const request = db.transaction(['projects']).objectStore('projects').getAll();
    request.onsuccess = (e) => {
        list = e.target.result;
        console.log(list);
        handler(list);
    };
    // So basically, handler is a function that will do its magic on list. It's basically storing functions in variables and then calling them later
}

function addToDB(project) {
    const request = db.transaction(['projects'], 'readwrite').objectStore('projects').add(project);
    request.onsuccess = (e) => {
        console.log('Project added to DB.');
    };
    request.onerror = (e) => {
        console.log('Project not added to db');
    };
}

function updateInDB(project) {
    const request = db.transaction(['projects'], 'readwrite').objectStore('projects').put(project);
    request.onsuccess = (e) => {
        console.log('Project updated.');
    };
    request.onerror = (e) => {
        console.log('Project not updated.');
    };
}


/*
delete feature
- Create a delete icon when the projects and tasks are created
    - Add to existing functions createNewRow() and listTask()
- Add event listener to delete task or project from the projects list
    - delete task and delete table functions
    - You can base it off of finishTask(). Literally the same
- Update row or reload table

movetotop feature
- Modify listTask() structure to make way for 2 icons in each row
    - Might need to turn it into a table
- Add event listeners to the new buttons that does array operations with matching insertBefore() UI magic
    - Make this into a function
    - updateInDB()

*/