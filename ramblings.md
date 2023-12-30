# MD guide

*Italic* or _Italic_
**Bold** or __Bold__
***Bold Italic***
> Text quote
- List/bullet
---


# To-Do List, but make it fancy

## Introduction

> Imagine you have a task. Now that task has about N different steps that you need to do in order to reach a desired end result. Each task is a prerequisite of the previous task and you cannot proceed further without finishing the current one. It's easy enough to finish. Just do it step-by-step.

> But what if you have 5 big tasks, each of which has a varying number of steps?

__Solution: A to-do list web-app that allows you to breakdown a big project into smaller tasks__

- Project 1
    - Task 1
    - Task 2
    - Task 3
    - Task ...
    - Task N
- Project 2
    - Task 1
    - Task ...
    - Task N

__to-do table__: A table of to-do list items with the following columns: Project, Last Finished, Current Task, Check-In
__Project__: A to-do list item that may be broken down into smaller tasks. 
__Task N__: Terminal task. Upon accomplishment of Nth task, the user will be prompted to add another task or mark the project as finished.


## Features

+ __New Project__. Creating a new project will prompt for a __name__ and __start date__ only. 
    + Upon submission, the project will be added to the to-do table under the 'Project' column with the start date in subscript underneath

+ __New Task__. To add a new task to a project, the user will click on the 'Current Task' column where a prompt box will appear. The prompt box will allow the user to add tasks with a maximum character count of *MAX?*. A user can add 1 or more tasks [How will they add? JS magic? Create new input field on button click?] which will be saved upon clicking on a 'Add Tasks' button in the bottom of the prompt box.

+ __Finish Task__. There is a check button beside the 'Current Task' column items. Upon pressing the check button, the task in the 'Current Task' will be displayed in the 'Last Finished' and the next queued task will appear in 'Current Task'. If there are no quequed tasks, a prompt box will appear with 2 choices:
    > Add new task: [______________]
    > Mark project as 'Finished'
    + Projects marked as 'Finished' will be archived and removed from the to-do table. A separate table for archived tasks will be made available in another page.

+ __Modify Task__. Clicking the item in the 'Current Task' column will open the task queue. It is the same prompt box as when adding new tasks, but with additional features. Upon hovering on an existing task, an _X_ button and _->_ button will appear. _X_ will delete tasks from queue while _->_ will shift item to top of the queue. Clicking on an existing task will re-open the input field and allow modification to value.

+ __Check-In__. The 'Check-In' column has an input field for remarks and a _^_ button. Clicking the _^_ button will save any text written in the input field under current date. If the input field is empty, a default value = _"Checked-in today."_ will be saved. If the user made a little progress on the project's 'Current Task', they can note down their progress or just click the _^_ if they don't wish to write anything.

+ __Date__. Every task will be assigned a finishing date upon using the check button. This will be used in a 'Calendar View' of the project which summarizes the date when the project was started, check-in dates and notes, and task completion dates. 

+ __Navigation Bar__. The navigation bar will be a small side bar on the left side of the page. 


## Things I don't know how to do
- Creation/Reopening of new input field on click
- A clean prompt box, like in Notion
    > Solution: AddEventListener() on the buttons that creates an absolutely-positioned div on click
- Make divs appear on hover
    > Literally just an event listener on hover with a function that toggles display from none to block and vice versa


## blah
I can either do this as a table, or like, divs.
Create Classes called Project and Tasks.
    Project.queue
+ Use indexedDB to store to-do list data
    + onload func that imports db data into class object named Project
    + Project has methods that modify the project and tasks, and saves into the db