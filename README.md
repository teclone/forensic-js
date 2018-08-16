# ForensicJS - Module-based JS Library

ForensicJS is a collection of tested JavaScript modules that performs different kinds of web development tasks. It unifies all its API across target environments (browsers, node.js) and provides pollyfills wherever possible.

It is developed to be cross platform and can be used in both `browser` and `node.js` environments without additional setup needs.

## Contributing to ForensicJS

To actively contribute, inspect or take a walk through on the development process of this library, you should have the latest [Git](https://git-scm.com/), [Node.js](https://nodejs.org) and [NPM](https://www.npmjs.com/) installed and follow the steps below:

**Clone this repository to your machine:**

```shell
git clone git://github.com/harrison-ifeanyichukwu/forensic-js.git && cd forensic-js
```

**Install development dependencies:**

```shell
npm install
```

**Test comand:**

```shell
npm test
```

**View test in browser:**

```shell
npm start #start up the test server that ships with the project
```

Navigate to `http://localhost:4000/test` to view test.

## Customizing Your Build

You can customize your own build by tweaking the [Rollup-all](https://github.com/harrison-ifeanyichukwu/rollup-all) `.buildrc.json` config file located inside the project root directory as well as the `exports.js` file (located inside the src directory).

```shell
npm run build
```

By default, separate builds are created in both `CommonJS` & `IIFE` formats for [node.js](https://nodejs.org/en/) & browsers respectively. All browser builds are located inside the `dist` directory while [node.js](https://nodejs.org/en/) builds are located inside the `lib` folder with separate entries for each module.

## Getting Started

**NPM Install:**

```shell
npm install --save forensic-js
```

**Node.js usage samples**:

```javascript
//import everything
import * as FJS from 'forensic-js';

//import some specific modules
import {Util, Queue, Xhr} from 'forensic-js';

//import a single module
import XML from './node_modules/forensic-js/lib/modules/XML.js';
```

**Browser usage samples**:

```html
<!-- include forensic-js. exposes FJS on the window -->
<script type="text/javascript" src="node_modules/forensic-js/dist/exports.js"></script>

<!-- include Xhr module. exposes Xhr on the window -->
<script type="text/javascript" src="node_modules/forensic-js/dist/modules/Xhr.js"></script>

<!-- include XPath module. exposes XPath on the window -->
<script type="text/javascript" src="node_modules/forensic-js/dist/modules/XPath.js"></script>
```

>**Note that minified builds are available too.**

## Current Modules

1. [Globals module](#globals-module)
2. [Utility module](#utility-module)
3. [Queue module](#queue-module)
4. [Event module](#event-module)
5. [Xhr module](#xhr-module)
6. [XML module](#xml-module)
7. [XPath module](#xpath-module)

## Globals Module

The `Globals` module provides unified global variables that all other modules use which include the host (`window`) and root (`document`) objects. The purpose is to make all other library modules independent of runtime environment, and to make component testing easy.

It provides the `install`, and `uninstall` methods, which are used to set and unset the window & document objects (which can come from an `iframe`, `node-jsdom`, `topmost window`, etc.) on a global level respectively.

All modules provide the `install` and `uninstall` methods, when used separately.

**Using `FJS` in `node.js`**:

```javascript
import * as FJS from 'forensic-js';
import {JSDOM} from 'jsdom';

let dom = new JSDOM('');
FJS.install(dom.window, dom.window.document);

//using with a single module
import XML from './node_modules/forensic-js/lib/XML.js';
XML.install(dom.window, dom.window.document);
```

The Globals module performs a check for the presence of a `window` and `document` objects, and installs them if both are found. Hence there is no need to call the `install(host, root)` method when running in a browser.

**Automatically Detect Objects**:

```javascript
import {JSDOM} from 'jsdom';

let dom = new JSDOM('');

//set global window and document
global.window = dom.window;
global.document = window.document;

//will automatically detect and install
import * as FJS from 'forensic-js';

//will still automatically detect and install
import XML from './node_modules/forensic-js/lib/XML.js';
```

## Utility Module

The `Util` module provides some bunch of utility methods that are handy to most other modules. Many of these methods tests variable types, perform string operations, run scoped processes and lots more.

**Test Variables Types**:

```javascript
Util.isCallable(variable);
Util.isArray(variable);
Util.isObject(variable);
Util.isPlainObject(variable);
...
```

**Generate a Callback function**:

```javascript
let callback = function(name, age) {
    console.log(`My name is ${name}. I am ${this.age} years old`);
},
scope = {age: 21};

Util.generateCallback(callback, scope, 'Harrison')();
//will log My name is Harrison. I am 21 years old.
```

**Run code Safely, Supress any Runtime Errors**:

```javascript
let callback = function(arg1) {
    console.log(arg1);
    throw new Error('this error will be suppressed');
},
scope = {age: 21};

Util.runSafe(callback, scope, 33);
//logs 33

/**
* run the callback after some given number of milliseconds have passed.
* it returns a promise in such cases
*/
Util.runSafe(callback, scope, 30, 5000).then(() => {console.log('done')});
```

**Encode query components**:

```javascript
console.log(Util.encodeComponent('name', 'Uchenna'));
//name=Uchenna

console.log(Util.encodeComponents({
    username: 'elvis',
    password: 'random'
}));

//username=elvis&password=random;
```

**Generate random text**:

```javascript
//generates a random string that is 8 character length
console.log(util.getRandomText(8));
```

**Apply Camel Casing**:

```javascript
console.log(Util.camelCase('user-name'));
//logs userName

console.log(Util.camelCase('user;name', ';')); //pass in the delimeter as second option
//logs userName
```

The [Util](#utility-module) module contains lots of other methods, such as `nodeContains(parent, child)` method, `loadInlineCSS(cssCode)`, `mergeObjects(...objects)` methods.

## Queue Module

This module offers great possibilities for managing related items, letting you sort, search, delete, manipulate items using different criteria as suits your application. It is built to be extensible and offers array-like operations on the queued items.

```javascript
//module signature
new Queue(
    items?: any[]|any,
    sortable?: boolean,
    caseSensitive?: boolean,
    defaultFnSort?: ((item1: any, item2: any, caseSensitive: boolean): number),
    defaultFnSearch?: ((key: any, compareWith: any, caseSensitive: boolean) => number)
);
```

**Usage example:**

A simple usage example would be to process a list of employees data as loaded from a server. The resulting response is assumed to be in [JSON](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON) format.

**The employees data structure**:

```json
[
    {
        "id": 1,
        "name": "Aaron Munachi",
        "salary": 150
    },
    .....more records
]
```

**Load and create an employees Queue**:
It uses the [Xhr module](#xhr-module) to fetch the resource.

```javascript
Xhr.get('/employees').then((response) => {
    //default sort function. sorts using the id criteria
    let defaultFnSort = function(emp1, emp2) {
        return Queue.fnSort(emp1.id, emp2.id);
        //always reuse the Queue class' static fnSort method.
    },

    //default search method. searches using the id criteria.
    defaultFnSearch = function(empId, emp, caseSensitive) {
        return Queue.fnSearch(empId, emp.id, caseSensitive);
        //always reuse the Queue class' static funSearch method.
    };

    //create the employees Queue
    let employees = new Queue(response.json(), true, true, defaultFnSort, defaultFnSearch);
});
```

**Iterating through items**:

```javascript
// List all employees in ascending order using the id criteria
/**
 * outputs a row of data to our table
*/
function writeRow(target: HTMLTableSectionElement, ...cellValues: any[]) {
    let row = target.insertRow();
    cellValues.forEach(cellValue => {
        let cell = row.insertCell()
        .appendChild(document.createTextNode(cellValue));
    });
};

/**
 * clear all row
*/
function clearRows(target: HTMLTableSectionElement) {
    let len = tBody.rows.length;
    while (--len >= 0) {
        tBody.deleteRow(len);
    }
}

let table = document.getElementById('employees-table'),
    tHead = table.tHead,
    tBody = table.tBodies[0];

//output header.
writeRow(tHead, '#id', 'name', 'salary');

//output rows
employees.forEach((emp) => {
    writeRow(tBody, emp.id, emp.name, employer)
});
```

**Note that** we did not have to sort the result set as it is already sorted when it was created.

**Deleting Items**:

```javascript
//delete the first employee whose id equals 1
employees.deleteItem(1);

//delete employee at index 3. index starts from 0.
employees.deleteIndex(3);
```

**Run Utility Operations**:

```javascript
//Filter out employees whose salary exceeds $200
let topEarners = employees.filter(emp => emp.salary > 200);

//check if all employees earn at least $50
console.log(employees.every(emp => emp.salary >= 50));

//check if some employees earn below $50
console.log(employees.some(emp => emp.salary < 50));

//calculate all employees salary added together
console.log(employees.reduce((result, current) => result + current.salary, 0);
```

**Extend list of criteria afforded by the instance**:

```javascript
//add sort & search by name criteria
employees.addSortFunction('by-name', (emp1, emp2) => {
    return Queue.fnSort(emp1.name, emp2.name);
})
    .addSearchFunction('by-name', (empName, emp, caseSensititve) => {
        return Queue.fnSearch(empName, emp.name, caseSensititve);
    });

//add sort & search by salary criteria, but in descending order
employees.addSortFunction('by-salary', (emp1, emp2) => {
    return Queue.fnSort(emp2.salary, emp1.salary);
})
    .addSearchFunction('by-salary', (empSalary, emp, caseSensititve) => {
        return Queue.fnSearch(emp.salary, empSalary, caseSensititve);
    });
```

**Sort using a specific criteria**:

```javascript
//list employers using their salary as criteria
clearRows(tBody);

employees.sort('by-salary');
for (const emp of employees)
    writeRow(tBody, emp.id, emp.name, emp.salary);
```

**Perform search & delete operations**:

The `indexOf(key: any, criteria?: string): number` searches for the given `key` using the criteria or default criteria if not specified. It returns the index position of the first item match or `-1` if no result is found.

```javascript
console.log(employees.indexOf(302, 'by-salary'));

//return true if there is an item matching the queue
includes(key: any, criteria?: string): boolean

//find and return the first item that matches the key.
//returns null if not found. optionally delete the item if found
find(key: any, criteria?: string, deleteIfFound?: boolean): item|null

//delete first employee whose name equals 'Aaron Munachi'
employees.deleteItem('Aaron Munachi', 'by-name');
```

**Write A Custom Queue class that extends the `Queue` module**

```javascript
import {Queue, Util} from 'forensic-js';

class Employees extends Queue {
    constructor(items, sortable, caseSensitive, fnSort, fnSearch) {
        super(items, sortable, caseSensitive, fnSort, fnSearch);
    }

    /**
     * define a quard method, that screens out invalid employee objects during insertion
     * operations.
     *
     *@override
    */
    screen(item) {
        return super.screen(item) && Util.isPlainObject(item) && Util.isNumber(item.id)
        && this.includes(item.id) === false;
    }
}
```