// Back-end objects
let projects = [];
let highestKey = 0; // TODO: onload, update highestKey based on the last item on project list
let openedSidePopup; // tracks the current open side popup. Only 1 can be open at a time

class Project {
    constructor(name, taskList, startDate) {
        this.name = name;
        this.tasks = taskList;
        this.startDate = startDate;
        this.key = highestKey + 1;
        
        this.lastFinished = null; // When loading from db, assign this directly after the constructor
    }
}

function finishTask(e) {
    const projectName = e.currentTarget.parentElement.parentElement.querySelector('.projectName').textContent;
    const currentRow = e.currentTarget.closest('tr');

    const project = projects.filter((object) => {
        return object.name === projectName;
    })

    if (project[0].tasks.length > 0) {
        project[0].lastFinished = project[0].tasks.shift();
        updateRow(currentRow, project[0]);
        console.log(`"${project[0].lastFinished}" moved to Last Finished.`);
    }
    else {
        console.log(`No task available.`)
    }
    
}

// Query selectors
const newProjectWindow = document.querySelector("#newProjectPopup");
const newProjectButton = document.querySelector("#newProjectButton");
const overlay = document.querySelector("#overlay");
const submitNewProject = document.querySelector("#newProjectPopup button")
const closeButtons = document.querySelectorAll(".close");
const projectName = document.querySelector("#projectName");
const projectTask = document.querySelector("#projectTask");
const dateStarted = document.querySelector("#dateStarted");
const tbody = document.querySelector('tbody');

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
        return;
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

// New Project
newProjectButton.addEventListener('click', openNewProjectWindow);
submitNewProject.addEventListener('click', newProject);

function openNewProjectWindow() {
    const isHidden = getComputedStyle(newProjectWindow).display === 'none';

    if (isHidden) {
        newProjectWindow.style.display = 'block';
        overlay.style.display = 'block';
    }
    else {
        newProjectWindow.style.display = 'none';
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
    
    console.log('Popup update function not available yet.')

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
    const finishButton = document.createElement('td');
        const icon = document.createElement('img');

    name.textContent = project.name;
    name.setAttribute('class', 'projectName');
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
        sidePopup.appendChild(header);
    
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

/*
// Pop-up divs testing
const taskQueue = document.querySelectorAll(".current-task");
const closeButton = document.querySelectorAll(".close");
const overlay = document.querySelector('#overlay');
let openDiv = null;

for (const project of taskQueue) {
    project.addEventListener('click', popTaskDiv);
}
for (const button of closeButton) {
    button.addEventListener('click', closePop);
}


function popTaskDiv(event) {
    const popup = event.currentTarget.querySelector('div.popup.tasks');

    if (event.target !== event.currentTarget) {
        return;
    }

    isHidden = getComputedStyle(popup).display === 'none';

    if (isHidden) {
        popup.style.display = 'block';
        if (openDiv && openDiv !== popup) { // AKA if there is an open div that is not our current target, close that
            openDiv.style.display = 'none';
        }
    }
    else {
        popup.style.display = 'none';
    }

    openDiv = popup;
}

// New project popup window thingy

const newButton = document.querySelector('#new-project');
const closeNewProject = document.querySelector('#closeNewProject');

newButton.addEventListener('click', newProject);
closeNewProject.addEventListener('click', closePop);

function newProject() {
    const popupWindow = document.querySelector('.popup.window');

    isHidden = getComputedStyle(popupWindow).display === 'none';

    if (isHidden) {
        popupWindow.style.display = 'block';
        overlay.style.display = 'block';
    }
    else {
        popupWindow.style.display = 'none';
        overlay.style.display = 'none';
    }
    
}

function closePop(event) {
    const popup = event.currentTarget.closest('.popup');
    
    const isOpen = getComputedStyle(popup).display === 'block';
    const isOverlay = getComputedStyle(overlay).display === 'block';

    if (isOpen) {
        popup.style.display = 'none';
    }
    if (isOverlay) {
        overlay.style.display = 'none';
    }
}




// Project and Task classification
class Project {

    constructor(name, startDate) {
        this.name = name;
        this.startDate = startDate;
        this.tasks = [];
        this.dbKey = dbKey;
        this._lastFinished = null;
    }


    // Methods
    // Might need to set the functions to async once IndexedDB is used
    addNewTask(task) {
        this.tasks.push(task);
        this.saveToDB();
    }

    deleteTask(index) {
        if (index.isNumber() && index < this.tasks.length && index >= 0) {
            return this.tasks.splice(index, 1);
        }
        this.saveToDB();
    }
    
    finishCurrentTask() {
        if (this.tasks.length > 0) {
            this._lastFinished = this.tasks.shift();
        }
        this.saveToDB();
    }

    saveToDB() {
        // Save current object properties into db
    }

    // Getters    
    get currentTask() {
        return this.tasks[0];
    }
    get lastFinished() {
        return this._lastFinished;
    }
}


/*
When clicking the (+) button or loading project objects from db, 
use createNewRow() function to insert into table.

This function accepts a Project object.

function createNewRow(project) {
    const table = document.querySelector('table');
    const row = document.createElement('tr');

    const projectName = document.createElement('td');
    const lastFinished = document.createElement('td');
    const currentTask = document.createElement('td');
    const checkIn = document.createElement('td');

    projectName.textContent = project.name;
    lastFinished.textContent = project.lastFinished;

    const currentName = document.createElement('span');
    currentName.setAttribute('class', 'current-task');
    currentName.textContent = project.currentTask;
    
    const popup = document.createElement('div');
    popup.setAttribute('class', 'popup tasks');
    popup.textContent = 'Input field and display under construction';
    currentName.appendChild(popup);
    
    const finishButton = document.createElement('button');
    finishButton.setAttribute('class', 'finish-task table');
    finishButton.addEventListener('click', project.finishCurrentTask); // Might need to use await once the db functions are set up
    
    currentTask.appendChild(currentName);
    currentTask.appendChild(finishButton);
    
    const comments = document.createElement('input');
    const checkInButton = document.createElement('button');
    comments.setAttribute('placeholder', "Today's progress is...");
    checkInButton.setAttribute('class', 'check-in table');
    checkInButton.addEventListener('click', project.checkin); // Might need to use await once the db functions are set up
    checkIn.appendChild(comments);
    checkIn.appendChild(checkInButton);

    table.appendChild(row);
}
*/