// IndexedDB 101
/*
1.) loadProjects() function that will request data from the db and construct instances of Project class for each item
2.) loadTable() function is called inside loadProjects() which will loop through each Project instance and create list elements to append to the html table
3.) saveToDB() function that takes the Project properties and upserts the record in the db

For testing purposes
object = {
    name: CS50x,
    startDate: January 1, 2023,
    tasks: ['Finish final project', 'README file']
}
*/

// Initialize array to hold Project instances
const projectList = [];

// Project and Task classification
class Project {

    constructor(name, startDate, dbKey) {
        this.name = name;
        this.startDate = startDate;
        this.tasks = [];
        this.dbKey = dbKey;
        this._lastFinished = null;
    }


    // Methods
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

const projectName = document.querySelector("#projectName");
const addButton = document.querySelector("#addButton");
const display = document.querySelector("#display");

addButton.addEventListener("click", (e) => {
    e.preventDefault();

    const project = document.createElement("div");
    const date = document.createElement("span")
    const today = new Date();
    date.textContent = today.getMonth() + "/" + today.getDate() + "/" + today.getFullYear();

    const object = new Project(projectName.value, date.textContent, 0);
    projectList.push(object);
    
    const deleteButton = document.createElement("button");
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => {
        display.removeChild(project);
        projectList.pop(project);
    })

    project.textContent = object.name;
    project.appendChild(date);
    project.appendChild(deleteButton);
    display.appendChild(project);
})
