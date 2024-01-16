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


// Query selectors
const projectName = document.querySelector("#projectName");
const addButton = document.querySelector("#addButton");
const display = document.querySelector("#display");


// IndexedDB tutorial
let db;
const request = window.indexedDB.open("MyTestDatabase", 3); /* Open the db
this returns an IDBOpenDBRequest object with result and error properties
the 2nd parameter is a number indicating the version which determines the db schema.
if the db doesn't exit, open creates it and triggers an onupgradeneeded event.
if it exists but with a higher version, onupgradeneeded is also triggered. */

// Setting up event handlers on onerror() and onsuccess() functions 
request.onerror = (e) => {
    console.error("Permission denied by user.")
};

request.onsuccess = (e) => {
    db = e.target.result;
};
/* If everything goes wll, a success event (a DOM event whose type property is set to "success") is fired with request as its target.
request.onsuccess is triggered with the success event as the argument.
Otherwise, error is fired instead of success.
    Common causes of error when opening a db:
    > user does not give permission to app to create a db
*/

db.onerror = (e) => {
    console.error(`DB error: $(event.target.errorCode)`);
};
/* Much like onclick, events like onerror also bubble up to the parent.
In this case, the parent of the event's target (request) would be the transaction whose parent would then be the db.
So if you attach an onerror handler to the db, it will also trigger if any error happens within its descendants.
*/

// I love it when things make sense

request.onupgradeneeded = (e) => {
    const db = e.target.result; // save the resulting db that was returned by the request
    const objectStore = db.createObjectStore('name', {keyPath: 'myKey'});
    /* You do not need to create object stores that are already in the older versions, but you can delete them if needed
    To update, you need to delete and recreate
    'myKey' in this case is one of the properties of the data object that is presumably unique
    */
    const objStore = db.createObjectStore('names', {autoIncrement: true });
    /* this ^ is a key generator which automatically starts from 1 and increments by 1
    It can only be accessed in the success event when adding the data the key is assigned to.
    You need to make sure to catch the result value of the target like so:
    
    const keyValue = e.target.result

    where e is the event, target is the add request, and result is the key value
    */
};
/* This event is triggered when you create a new database or open an existing db with a higher version number.
you create the object stores needed for the new version of the db in the event handler.
This event is implimented only in recent browsers.

Creating object stores with the same name or deleting non-existing object stores will give an error

after succesfully going through the onupgradeneeded event, the onsuccess will then proceed
*/

const transaction = db.transaction(["customers"], "readwrite");
/* argument 1 is a list of object stores that you want
argument 2 is the mode. other option is readonly (and versionchange)
*/

transaction.oncomplete = (e) => {
    console.log("All done!");
};

transaction.onerror = (e) => {
    // Add error handlers here
}

const objectStore = transaction.objectStore("customers");
customerData.forEach((customer) => {
    const request = objectStore.add(customer);
    request.onsuccess = (e) => {
        // e.target.result === customer.ssn;
    };
});

// You can also compress the transaction -> request. Since the error bubbles up to db, request.onsuccess won't ever happen if an error is triggered in any of the steps
const request = db
    .transaction(["customers"], "readwrite")
    .objectStore("customers")
    .delete("444-44-4444");
request.onsuccess = (e) => {
    // Deleted!
}

const transaction = db.transaction(["customers"]); // defaults to readonly
const objectStore = transaction.objectStore("customers");
const request = objectStore.get("444-44-4444");
request.onerror = (e) => {
    // handle errors here
};
request.onsuccess = (e) => {
    // do smth with request.result
};

// even shorter ver as long as you have db error handler
db
    .transaction("customers", "readwrite") // can skip the list since it's just 1 obj store
    .objectStore("customers")
    .get("444-44-4444").onsuccess = (e) => {
        // the event is a success attached to the get request with the result of the object data
        const data = e.target.result;

        data.age = 42;

        const requestUpdate = objectStore.put(data);
        requestUpdate.onerror = (e) => {
            // error blah
        };
        requestUpdate.onsuccess = (e) => {
            // data is updated inside the db;
        };
    };

// if you want to iterate through the whole object store
const customers = [];

objectStore.openCursor().onsuccess = (e) => {
    const cursor = e.target.result;
    if (cursor) {
        customers.push(cursor.value);
        cursor.continue;
    }
    else {
        console.log("No more entries!");
    }
};

// if you just want everything in a an array
objectStore.getAll().onsuccess = (e) => {
    customers = e.target.result; // the result is an array of objects (like a list of dictionaries)
}

console.log(`${objectStore} is the object store`)
