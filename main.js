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
*/
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

