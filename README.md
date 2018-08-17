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

## Event Module

The `Event` module abstracts away `dom` and `custom` event handling logic from the browser and stops the browser from propagating events down and up the document tree. It does this by registering just two event listeners on the `host` & `root` object, and calls `event.stopPropagation()` at those top levels.

It then handles the event propagations internally, taking care of `capturing phase` listeners, `passive` listeners, `runOnce` listeners, `target phase only` listeners, listeners' `priority` run order and lots more.

The rationale behind this module is to:

1. Provide unified interface for cross platform event handling, providing pollyfill for unimplemented Event interfaces such as [Pointer Events](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent), [Input Events](https://www.w3.org/TR/uievents/#events-inputevents), etc.

2. Remove the hazzle associated with binding listeners for vendor prefixed events such as [Animation](https://www.w3.org/TR/css-animations-1/#events) and [Transition](https://www.w3.org/TR/css-transitions-1/#transition-events) events. You simply specify the event type such as `transitionend` without worrying about the accurate vendor prefixed type.

3. Remove the hazzle associated with some browsers dispatching certain events on `window` while others dispatch same on the `document`. You choose where to register the handler, `document` or  `window`. It takes care of it.

4. Offer ability to unbind even annonymous functions throught `Event.unbindAll(type, target, config)` method.

5. Prevent the browser from dispatching incessant event and from performing `dom tree walk` while propagating events.

6. Offer ability to alter the order of execution of event listeners through the `config.priority`, `config.runFirst`, and `config.runLast` flags.

7. Offer a centralized system where events are handled, throttled (resize and scroll events), rejected or debounced.

> **NB:** When binding events using vanilla JavaScript or other Event libraries, you should disable this module from stopping the browser from propagating events. To do this, set the `.silenceEvents` property to false. i.e `Event.silenceEvents = false`.

**Listening for DOM Ready Event**:

To run a callback once the document is ready, use the `.ready(callback, scope?, ...parameters?)` method. You can register multiple callback functions by calling this method multiple times. It is chainable.

```javascript
Event.ready((e) => {
    console.log('document is ready');
})
    .ready((e) => {
        console.log('second call');
    });
```

You can as well pass in a `scope` object as a second parameter, as well as extra comma separated list of parameters to pass to `callback` function during execution.

**Binding Event Listeners**:

To bind event listeners, there is the `.bind()` && `.on()` methods that binds an `event` listener callback for a given set of event `type(s)` on a given event `target`.

```javascript
//method signature
E.bind(
    type: string|string[],
    callback: ((event: Event, ...args?: any[]) => void),
    target: EventTarget,
    config?: EventConfigOptions|null,
    scope?: {}|null,
    ...parameters?: any[]
);

let testDiv = document.getElementById('my-div');

//click event listener
Event.bind('click', (e) => {
    console.log(e.type);
}, testDiv)

    .on('click', (e) => {
        console.log(e.type);
    }, testDiv)

    .dispatch('click', testDiv); //trigger the click event.
```

**Binding RunOnce Event Listeners**:

To bind event listener callbacks that will only get executed once, set the boolean `config.runOnce` parameter to `true` or use the `once()` bind method

```javascript
let testImage = new Image();

Event.bind('load', (e) => {
    console.log('image is loaded');
}, testImage, {runOnce: true})

    .once('load', (e) => {
        console.log('image is loaded');
    }, testImage);

testImage.src = 'image.png';
```

**Binding Listeners on the Capturing Phase**:

To bind event listener callback that will get executed in the capturing phase, set the boolean `config.capture` parameter to `true`. The default value is `false`.

```javascript
Event.once('click', (e) => {
    console.log(e.phase); //logs 1
}, document.body, {capture: true})

    .dispatch('click', document.body.firstElementChild);
```

> **NB**. Event listeners bound on the capturing phase are not executed for events that originated from the target. Events that originated from the target will be on the `target phase` by the time it reaches the `target` element.

**Binding Listener on the target Phase Only**:

To bind event listener callbacks that will get executed for only events that originated from the target, set the boolean `config.acceptBubbledEvents` parameter to `false`. The default value is `true`.

```javascript
let testDiv = document.createElement('div');
document.body.appendChild(testDiv);

let callCount = 0,

    callback = function() {
        callCount += 1;
    };

_Event.bind('click', callback, document.body, {
    acceptBubbledEvents: false
})

    .dispatch('click', testDiv) // this event should not trigger the callback

    .dispatch('click', document.body) // this event should trigger the callback

    .unbind('click', callback, document.body);

console.log(callCount); //logs 1
```

Only the second event `dispatch` will trigger the `listener`. The first event `dispatch` will not despite bubbling up to the testDiv parent element (`document.body`).

**Binding Passive Event Listeners**:

Passive event listeners are event listeners that is not supposed to call `preventDefault()`, thereby telling the browser before hand to keep updating the `UI` and not wait for the listener to finish executing.

To use this feature, set the boolean `config.passive` parameter to `true`. The default value is `false`. Passive event listeners are great for events like `touch events`, and `wheel events`. To learn more about passive events, and web scroll performance check this [google developers article](https://blog.chromium.org/2016/05/new-apis-to-help-developers-improve.html).

```javascript
Event.on('touchstart', (e) => {
    console.log(e.passive); //logs true.
    e.preventDefault(); // not acceptable. throws error
}, document.body, {
    passive: true
});
```

**Alter the Execution Order of Event Listeners**:

The `Event` module makes it possible and easy to alter the execution order of event listeners, thanks to the power afforded to it by the [Queue](#queue-module) module. By using this feature, you can achieve a great effect as you dictate how `event` listeners are to be executed.

1. **Alter Through The `config.priority` Option**:

    By specifying a `priority` value for a listener callback during the bind process, we can alter its execution in the midst of other bound listeners, like below:

    ```javascript
    let signatures = [],
    testImage = new Image(300, 500);

    let firstListener = function() {
            signatures.push('first');
        },

        secondListener = function() {
            signatures.push('second');
        },

        thirdListener = function() {
            signatures.push('third');
        };

    Event.bind('load', firstListener, testImage, {
        priority: 9 // gets executed last after callback with default priority of 5
    })

        .on('load', secondListener, testImage) //default priority of 5 is assigned.

        .on('load', thirdListener, testImage, {
            priority: 1 //gets executed first.
        })

        .dispatch('load', testImage)

        .unbindAll('load', testImage); //unbind  all the load event listeners

    console.log(signatures.join('>>')); //logs third>>second>>first
    ```

    > **NB:** Priority values are rated higher in descending order. priority value of `3` is rated higher than priority value of `10` for instance.

2. **Alter Through The `config.runFirst` Option**:

    By setting the `runFirst` option to `true`, on a listener callback during the bind process, You are asking that the listener should be executed first in the midst of other listeners along the chain of the event target.

    Note that, when there are two or more listeners with the `runFirst` flag set to `true`, their `priority` values will be used.

    ```javascript
    let signatures = [],
        testInput = document.createElement('input');
    testInput.type = 'text';

    let firstListener = function() {
            signatures.push('first');
        },

        secondListener = function() {
            signatures.push('second');
        },

        thirdListener = function() {
            signatures.push('third');
        };

    Event.on('keydown', firstListener, testInput) // priority defaults to 5. gets executed last

        .on('keydown', secondListener, testInput, {
            priority: 3 //gets executed immediately after the thirdListener.
        })

        .on('keydown', thirdListener, testInput, {
            priority: 10,
            runFirst: true //gets executed first due to the runFirst config despite having
            //the least priority
        })

        .dispatch('keydown', testInput)

        .offAll('keydown', testInput); //unbind all the keydown event listeners

    console.log(signatures.join('>>')); //logs third>>second>>first
    ```

3. **Alter Through The `config.runLast` Option**

    By setting the `runLast` option to `true`, on a listener callback during the bind process, You are asking that the listener should be executed last in the midst of other listeners along the chain of the event target.

    Note that, when there are two or more listeners with the `runLast` flag set to `true`, their `priority` values will be used.

    ```javascript
    let signatures = [],
        testInput = document.createElement('input');
    testInput.type = 'text';

    let firstListener = function() {
            signatures.push('first');
        },

        secondListener = function() {
            signatures.push('second');
        },

        thirdListener = function() {
            signatures.push('third');
        };

    Event.bind('focus', firstListener, testInput, {
        priority: 1,
        runLast: true // gets executed just before the secondListener, because of the
        //priority difference though both are configured to run last.
    })

        .bind('focus', secondListener, testInput, {
            runLast: true //gets executed last. it priority is defaulted to 5
        })

        .bind('focus', thirdListener, testInput, {
            priority: 10 //gets executed first. despite having the least priority.
            //This is because other listeners have been configured to run last.
        })

        .dispatch('focus', testInput)

        .unbindAll('focus', testInput); //unbind all the focus event listeners

    console.log(signatures.join('>>')); //logs third>>first>>second
    ```

**Specifying Execution Scope and Extra Parameters**:

You can specify an execution scope object as a fifth parameter. If specified, the `this` object inside the listener will refer to the object rather than the event `target`.

```javascript
let isAccurateScope = false,
    scope = {id: 'testing scope'};

let callback = function() {
    if (this === scope)
        isAccurateScope = true;
};

Event.bind('copy', callback, document, {
    runOnce: true
}, scope)

    .dispatch('copy', document);

console.log(isAccurateScope); // logs true
```

You can also pass in additional **comma separated** list of parameters that will be sent to the listener callback.

```javascript
let list = [];

let callback = function(e, param1, param2, param3) {
    list.push(param1, param2, param3);
};

_Event.once('pagehide', callback, window, null, null, 1, 2, 3)
/**            ^^^       ^^^^^^   ^^^^^^  ^^^^^ ^^^^^ ^^^^^^^
 *              ||          ||       ||     ||     ||     ||
               type      listener  target config scope parameters
**/
    .dispatch('pagehide', document); //trigger on document, it will bubble to window

console.log(list.join('>>')); //logs 1>>2>>3
```

## Xhr Module

This is an `XMLHttpRequest` [promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) based implementation of [fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)  with inbuilt request prioritization and polling manager. It exposes similar features as offered by [Request](https://developer.mozilla.org/en-US/docs/Web/API/Request), [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response), and [Headers](https://developer.mozilla.org/en-US/docs/Web/API/Headers) API.

Unlike in [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch) that rejects only on network error, the **Xhr** module rejects all responses whose status code does not fall withing the `200` mark and is not a [304, Not Modified](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/304) status code.

**Making a simple fetch call**:

```javascript
Xhr.fetch(url).then(response => {
    console.log(response.ok); // true
})
    .catch(response => {
        let message = '';
        switch (response.statusCode) {
            case 404:
                message = 'Resource not found';
                break;
            //more test cases follows
        }
    });
```

**Restful methods**:

By default, the fetch method uses `GET` method for requests, unless a second options object is passed in. You can make use of restful methods that are already made available.

```javascript
type requestOptions = {
    method?: string,
    responseType?: 'json'|'document'|'blob'|'arraybuffer',
    data?: {}|FormData,
    cache?: 'no-cache'|'force-cache'|'only-if-cached'|'default'|'reload',
    priority?: number,
    withCredentials?: boolean,
    timeout?: number|null,
    contentType: string,
    progress?: ((loaded: number, total: number) => void),
    headers?: {}
};

//universal
Xhr.fetch(url: string, options?: requestOptions);

//make GET request
Xhr.get(url: string, options?: requestOptions);

//make POST request
Xhr.post(url: string, options?: requestOptions);

//make PUT request
Xhr.put(url: string, options?: requestOptions);

//make HEAD request
Xhr.head(url: string, options?: requestOptions);

//make DELETE request
Xhr.delete(url: string, options?: requestOptions);

//make OPTIONS request
Xhr.options(url: string, options?: requestOptions);
```

**Set Custom Global Request headers**:

To set custom global headers that is sent along with every request, use `Xhr.addHeader(name, value)` or `Xhr.addHeaders(headers)` methods. This is handy for setting global headers such as `X-CSRF-TOKEN`, `X-Requested-With`.

```javascript
//the calls are chainable
Xhr.addHeader('X-Requested-With', 'XMLHttpRequest').addHeaders({
    'X-CSRF-TOKEN': 'token'
});
```

To remove already set global headers, use `Xhr.removeHeader(headerName)` and `Xhr.removeHeaders(...headerNames)` methods.

```javascript
Xhr.removeHeaders('X-Requested-With', 'X-CSRF-TOKEN');
```

**Specify Request data through `options.data`**:

You can specify request data to send by passing in an `options.data` parameter. The parameter can either be a plain object containing data `key:value` pairs or a [FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData) object.

For [POST](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/POST) & [PUT](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/PUT) operations, the data is transmitted through the request body. For other methods, the data is transmitted through the url as encoded `query` parameters (only plain objects are accepted in this case).

```javascript
//use form data
let data = new FormData(), //we could just pass in the form to the constructor.
    elements = document.forms['frm-signup'];

data.append('username', elements.username.value);
data.append('email', elements.email.value);
data.append('password', elements.password.value);

let options = {
    data: data,
    responseType: 'json'
};

Xhr.post('user/create', options).then(response => {
    if (response.json().status === 'success')
        console.log('account created');
    else
        console.log(response.json().errors);
});
```

**Access Response headers. `Response#getHeader(name)` & `Response#getHeaders(camelize?`**:

To access response headers, there are `getHeader(name)` & `getHeaders(camelize?)` methods on the passed in [Response](#response) instance.

The former returns the value for a given header while the latter returns all the response headers in one go, as an object of header `name:value` pairs.

The `camelize` optional boolean parameter specifies if the header names should be turned into camel cases, allowing one to use the `.` notation when accessing headers. The default value is `true`.

```javascript
//get resource meta headers
Xhr.head('rss-feed.xml').then(response => {
    response.getHeader('Last-modified');

        //OR

    let headers = response.getHeaders();
    console.log(headers.contentType, headers.contentLength, headers.etag);

        //OR

    //get headers without camelizing the names.
    //all headers are in lowercase
    headers = response.getHeaders(false);
    console.log(headers['content-type'], headers['content-length'], headers['etag']);
});
```

**Alter Request execution order through `options.priority`**:

For a large application that has lots of requests to poll, one may decide to prioritize request polling based on their importance. For such scenerio, the `options.priority` method becomes handy. Note that the lower the assigned priority value, the more prioritized the request will be.

```javascript
/**
* here, we want to specify the order of request execution whenever there are
* requests for chat messages, news feeds, notifications, birthdays, likes,
* comments, etc
*/
Xhr.get('/feeds', {priority: 10});
Xhr.get('/messages', {priority: 4}); //more prioritized than feeds
Xhr.get('/post/id/comments', {priority: 5}); //less important than messages but more
//important than feeds
...
```

>Note that it has a way of balancing stuffs by promoting a request's `priority` level one step forward after the `request` has stayed in the queue for some determined number of milliseconds (the `promoteAfter` options which defaults `3000ms`). To change this value, use `Xhr.promoteAfter = msValue`.

**Alter how Response is Parsed through `options.responseType`**:

The `options.responseType` parameter specifies how the resulting `response` should be parsed regardless of the response `content-type` header. Accepted values includes `json`, `document`, `blob`, and `arraybuffer`.

```javascript
//fetch an html document
Xhr.get('/about.html', {responseType: 'document'}).then(response => {
    console.log(response.document.title);
});
```

>Note that by default, the module will parse response as [JSON](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON) if the response `content-type` header matches either of `application/json` or `text/json`.

**Watch for Request Progress through `options.progress`**:

To watch for progress events, simply pass in an options.progress callback parameter. The callback should accept two parameters, `loaded` & `total` data to load.

Usage could be to update a progress bar as below:

*HTML*:

```html
<div class="progress-bar" id="progress-bar">
    <div class="bar"></div>
</div>
```

*SCSS*:

```scss
.progress-bar {
    position: relative;
    background: grey;
    height: 30px;

    > .bar {
        display: absolute;
        background-color: blue;
        left: 0;
        width: 0;
        height: 100%;
        transition: width 0.15s ease;
    }
}
```

*JavaScript*:

```javascript
let progressBar = document.getElementById('progress-bar');
Xhr.post(url, {
    data: dataToPost,
    progress: (loaded, total) => {
        //update progress bar.
        let percent = (loaded / total) * 100;
        progressBar.style.width = `${percent}%`;
    }
});
```