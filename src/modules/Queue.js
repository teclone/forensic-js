/**
 * Queue module. this module gives the flexibility to manage related items as a queue,
 * able to sort and search items using different criteria, and lots more
 *@module Queue
*/
import Util from './Util.js';

export default class Queue {
    /**
     * default sort function suitable for sorting strings and numbers accurately.
     * always call this method from your own sort functions to ensure accuracy.
     *@param {number|string} one - sort item one
     *@param {number|string} two - sort item two
     *@returns {number}
    */
    static fnSort(one, two) {
        if (one === two)
            return 0;

        if (Util.isNumber(one) && Util.isNumber(two))
            return (one - two) < 0? -1 : 1;

        if (Util.isNumber(one))
            return -1;

        if (Util.isNumber(two))
            return 1;

        //if both are strings
        if (typeof one === 'string' && typeof two === 'string') {
            let lcOne = one.toLowerCase(),
                lcTwo = two.toLowerCase();

            if (lcOne === lcTwo)
                return one < two? 1 : -1;
            else
                return lcOne < lcTwo? -1 : 1;
        }

        if (typeof one === 'string')
            return -1;

        if (typeof two === 'string')
            return 1;

        return 0;
    }

    /**
     * default search function suitable for searching strings and numbers accurately.
     * always call this method from your own search functions, supplying the neccesary parameters
     * to maintain accuracy
     *@param {number|string} key - search key
     *@param {number|string} item - item to compare
     *@param {boolean} caseSensitive - boolean value indicating if search is case sensitive as
     * configured when creating the queue
     *@returns {number}
    */
    static fnSearch(key, item, caseSensitive) {
        if (key === item)
            return 0;

        if (Util.isNumber(key) && Util.isNumber(item))
            return (key - item) < 0? -1 : 1;

        if (Util.isNumber(key))
            return -1;

        if (Util.isNumber(item))
            return 1;

        if (typeof key === 'string' && typeof item === 'string') {
            let lcKey = key.toLowerCase(),
                lcItem = item.toLowerCase();

            if (!caseSensitive && lcKey === lcItem)
                return 0;

            if (lcKey === lcItem)
                return key < item? 1 : -1;
            else
                return lcKey < lcItem? -1 : 1;
        }

        if (typeof key === 'string')
            return -1;

        if (typeof item === 'string')
            return 1;

        return -1;
    }

    /**
     *@param {*} [items=[]] - a single item or array of items.
     *@param {boolean} [sortable=false] - set true if this queue should be sorted
     *@param {boolean} [caseSensitive=false] - a boolean value indicating if items should be treated as case sensitive
     * during search
     *@param {Function} [fnSort] - user defined sort function. sort functions accepts two arguments
     * and returns -1 if first argument should come before second argument, returns 1 if otherwise
     * or returns 0 if both are equal
     *@param {Function} [fnSearch] - user defined search function. search function should accept three arguments,
     * argument one is always what to search for (the search item), argument two is the item to compare to, while argument three is a
     * caseSensitive boolean value
     * search function should return -1 if search item comes before the second item, return 1 if otherwise and return
     * 0 if both items are equal
    */
    constructor(items, sortable, caseSensitive, fnSort, fnSearch) {
        this.items = [];
        this.sortable = sortable? true : false;
        this.caseSensitive = caseSensitive? true : false;

        this.fnSort = Util.isCallable(fnSort)? fnSort : Queue.fnSort;
        this.fnSearch = Util.isCallable(fnSearch)? fnSearch : Queue.fnSearch;

        this.alternateFnSorts = {}; // alternate sort functions gives you the flexibility to
        //sort and search using different criteria
        this.alternateFnSearchs = {}; // alternate search functions compliments the sort functions

        this.push(...Util.makeArray(items));
    }

    /**
     * return Queue as objects identity
     *@private
    */
    get [Symbol.toStringTag]() {
        return 'Queue';
    }

    /**
     * retrieves current queue length
     *@type {number}
    */
    get length() {
        return this.items.length;
    }

    /**
     * convert and return queue as an array
     *@returns {Array}
    */
    toArray() {
        return [...this.items];
    }

    /**
     * implement the iterable interface
     *@private
    */
    [Symbol.iterator]() {
        let items = this.items, index = -1, length = items.length;
        return {
            next() {
                let currentLength = items.length;
                //check if some items have been deleted
                if (currentLength < length) {
                    index -= length - currentLength;
                    length = currentLength;
                }
                if(++index < length)
                    return {done: false, value: items[index], index: index};
                else
                    return {done: true, value: undefined, index: undefined};
            }
        };
    }

    /**
     * adds sort function to the existing list of alternate sort functions.
     *
     *@param {string} criteria - the criteria for which the sort function will be utilized
     *@param {Function} fnSort - the sort function
     *@throws {TypeError} throws type error if criteria is not a string or if fnSort is not a function
     *@returns {this}
    */
    addSortFunction(criteria, fnSort) {
        if (typeof criteria !== 'string')
            throw new TypeError('argument one is not a string');

        if (!Util.isCallable(fnSort))
            throw new TypeError('argument two is not a function');

        this.alternateFnSorts[criteria] = fnSort;
        return this;
    }

    /**
     * returns the appropriate sort function for the given criteria
     *@param {string} criteria - the criteria for which the sort function will be utilized
     *@returns {Function}
     *@throws {Error} if there is no sort function defined for the given criteria
    */
    getSortFunction(criteria) {
        if (!criteria)
            return this.fnSort;

        if (typeof this.alternateFnSorts[criteria] === 'undefined')
            throw new Error(`no sort function defined for the given ${criteria} criteria`);

        return this.alternateFnSorts[criteria];
    }

    /**
     * adds search function to the existing list of alternate search functions
     *@param {string} criteria - the criteria for which the search function will be utilized
     *@param {Function} fnSearch - the search function
     *@throws {TypeError} throws type error if criteria is not a string or if fnSearch is not a function
     *@returns {this}
    */
    addSearchFunction(criteria, fnSearch) {
        if (typeof criteria !== 'string')
            throw new TypeError('argument one is not a string');

        if (!Util.isCallable(fnSearch))
            throw new TypeError('argument two is not a function');

        this.alternateFnSearchs[criteria] = fnSearch;
        return this;
    }

    /**
     * returns the appropriate search function for the given criteria
     *@param {string} criteria - the criteria for which the sort function will be utilized
     *@returns {Function}
     *@throws {Error} if there is no search function defined for the given criteria
    */
    getSearchFunction(criteria) {
        if (!criteria)
            return this.fnSearch;

        if (typeof this.alternateFnSearchs[criteria] === 'undefined')
            throw new Error(`no search function defined for the given ${criteria} criteria`);

        return this.alternateFnSearchs[criteria];
    }

    /**
     * adds sort functions to the existing list of alternate sort functions
     *@param {Object} entries - sort function entries with keys as criteria
     *@throws {TypeError} throws type error if entries is not an object, or if
     * criteria key is not a string or if entry value is not a function
     *@returns {this}
    */
    addSortFunctions(entries) {
        if (!Util.isPlainObject(entries))
            throw new TypeError('argument is not an object');

        for (let [criteria, fnSort] of Object.entries(entries))
            this.addSortFunction(criteria, fnSort);

        return this;
    }

    /**
     * adds search functions to the existing list of alternate search functions
     *@param {Object} entries - the search function entries with keys as criteria
     *@throws {TypeError} throws type error if entries is not an object, or if
     * criteria key is not a string or if entry value is not a function
     *@returns {this}
    */
    addSearchFunctions(entries) {
        if (!Util.isPlainObject(entries))
            throw new TypeError('argument is not an object');

        for (let [criteria, fnSearch] of Object.entries(entries))
            this.addSearchFunction(criteria, fnSearch);

        return this;
    }

    /**
     * return true if item meets implementation demand or false otherwise.
     * when extending this class, one can override it and define more generic screening test
     *@param {*} item - item to screen
     *@returns {boolean}
    */
    screen(item) {
        return typeof item !== 'undefined' && item !== null;
    }

    /**
     * sorts the queue
     *@param {string} [criteria] - sort criteria
     *@returns {this}
    */
    sort(criteria) {
        if(this.sortable && this.length > 0)
            this.items.sort(this.getSortFunction(criteria));
        return this;
    }

    /**
     * adds comma separated list of items that satisfy the screen test to the end of the queue
     *@param {...*} items - comma separated list of items to add
     *@returns {this}
    */
    push(...items) {
        this.items.push(...items.filter(this.screen, this));
        return this.sort();
    }

    /**
     * adds comma separated list of items that satisfy the screen test to the beginning of the queue
     * shifting other items accordingly
     *@param {...*} items - comma separated list of items to add
     *@returns {this}
    */
    unshift(...items) {
        this.items.unshift(...items.filter(this.screen, this));
        return this.sort();
    }

    /**
     * puts the item at the specified zero-indexed position if it passes screen test
     *@param {*} item - item to append
     *@param {number} [pos] - zero-indexed location to append item,
     * if not specified, the item is pushed to the end of the queue
     *@param {boolean} [replace=false] - set true to replace the item at the stated position
    */
    put(item, pos, replace) {
        if (this.screen(item)) {

            if (Util.isNumber(pos) && replace)
                this.items.splice(pos, 1, item);

            else if (Util.isNumber(pos))
                this.items.splice(pos, 0, item);

            else
                this.items.push(item);

            this.sort();
        }
        return this;
    }

    /**
     * returns the item at the given zero-indexed location
     *@param {number} pos - the zero-indexed position. negative numbers are resolved from
     * the end position
     *@returns {*} returns the item if location is feasible, or undefined if otherwise
    */
    item(pos) {
        if (this.length > 0 && Util.isNumber(pos)) {
            if (pos < 0)
                pos += this.length;

            if (pos >=0 && pos < this.length)
                return this.items[pos];
        }
        return undefined;
    }

    /**
     * removes and returns the first item in the queue
     *@returns {*}
    */
    shift() {
        return this.items.shift();
    }

    /**
     * removes and returns the last item in the queue
     *@returns {*}
    */
    pop() {
        return this.items.pop();
    }

    /**
     * returns the first item in the queue without removing it
     * it returns undefined if queue is empty
     *@returns {*}
    */
    first() {
        return this.item(0);
    }

    /**
     * returns the last item in the queue without removing it
     * it returns undefined if queue is empty
     *@returns {*}
    */
    last() {
        return this.item(this.length - 1);
    }

    /**
     * empties the queue
     *@returns {this}
    */
    empty() {
        this.items = null;
        this.items = [];
        return this;
    }

    /**
     * deletes item at the given index position from the queue
     *@param {number} index - zero-indexed position to delete. negative index are resolved from
     * the end
     *@returns {this}
    */
    deleteIndex(index) {
        if (this.length === 0)
            return this;
        if (!Util.isNumber(index))
            return this;

        if (index < 0)
            index += this.length;

        if (index >= 0 && index < this.length)
            this.items.splice(index, 1);

        return this;
    }

    /**
     * searches the queue for a given hash using a particular search criteria
     *@param {*} key - the search key
     *@param {string} criteria - the search criteria to use. uses default search function
     * if not given
     *@returns {number} returns the items index if found or -1 if not found
     *@throws {TypeError} - if you try searching for objects without specifying a search
     * criteria that you have defined
    */
    indexOf(key, criteria) {
        if (this.length === 0 || typeof key === 'undefined' || key === null)
            return -1;

        let fnSearch = this.getSearchFunction(criteria);

        //run iteration if queue is not sortable or if we are searching for an object
        // and there is no search method defined by the user
        if (!this.sortable || (fnSearch === Queue.fnSearch && Util.isObject(key))) {
            let keyIsString = typeof key === 'string',
                i = 0;
            for (let item of this) {
                if (item === key)
                    return i;
                if (!this.caseSensitive && keyIsString && typeof item === 'string' &&
                    key.toUpperCase() === item.toUpperCase())
                    return i;
                i += 1;
            }
            return -1;
        }

        let low = 0,
            high = this.length - 1,
            middle = Math.floor((high + low + 1) / 2),
            i = 0;

        this.sort(criteria);
        do {
            i = fnSearch(key, this.items[middle], this.caseSensitive);

            if (i === 0)
                return middle;
            else if (i < 0)
                high = middle - 1;
            else
                low = middle + 1;

            middle = Math.floor((high + low + 1) / 2);
        }
        while (low <= high);

        return -1;
    }

    /**
     * searches the queue for the given key. aliase for the has method
     *@param {*} key - the search key
     *@param {string} criteria - the search criteria to use
     *@returns {boolean} returns true if queue has item or false if otherwise
    */
    includes(key, criteria) {
        return this.indexOf(key, criteria) > -1;
    }

    /**
     * searches and returns the item that matches the key
     *@param {*} key - the search key
     *@param {string} [criteria] - the search criteria to use
     *@param {boolean} [deleteIfFound=false] - a boolean value indicating if item should be deleted if it is found
     *@returns {*} returns the item if found or returns undefined if not found
    */
    find(key, criteria, deleteIfFound = false) {
        let index = this.indexOf(key, criteria);
        if (index > -1) {
            let item = this.items[index];
            if (deleteIfFound) {
                this.deleteIndex(index);
            }
            return item;
        }
        return undefined;
    }

    /**
     * searches and deletes the item if found
     *@param {*} item - item to delete
     *@param {string} [criteria] - the search criteria to use
     *@returns {this}
    */
    deleteItem(item, criteria) {
        let index = this.indexOf(item, criteria);
        if (index > -1)
            this.deleteIndex(index);

        return this;
    }

    /**
     * clones the queue internals using the given items.
     *@param {*} [items] - item or array of items
    */
    cloneWith(items) {
        return new this.constructor(items, this.sortable, this.caseSensitive, this.fnSort, this.fnSearch)
            .addSortFunctions(this.alternateFnSorts)
            .addSearchFunctions(this.alternateFnSearchs);
    }

    /**
     * returns a clone of the object
     *@returns {Queue}
    */
    clone() {
        return this.cloneWith(this.items.slice(0));
    }

    /**
     * iterates over the queue and calls the callback function
     *@param {Function} callback - the callback function,
     * the callback function will receive at least three arguments, the item, index, and the queue
     * any additional parameters will be passed in between the item, and index parameter.
     * the callback should returned anything other than undefined to stop the iteration
     *@param {Object} [scope=this] - execution scope object
     *@param {...*} [parameters] - comma separated list of extra items parameters to pass to callback
     *@throws {Error} throws error if argument one is not a function
    */
    forEach(callback, scope, ...parameters) {
        if(!Util.isCallable(callback))
            throw new TypeError('argument one is not a function');

        scope = Util.isObject(scope)? scope : this;
        let index = -1,
            iLocation = 1 + parameters.length,
            array = [null, ...parameters, 0, this],
            runner = Util.generateCallback(callback, scope, array);

        for (let value of this) {
            array[0] = value;
            array[iLocation] = ++index;
            if (runner() !== undefined)
                break;
        }
        return this;
    }

    /**
     * tests whether all items in the queue pass test implemented by the callback method
     *@param {Function} callback - the callback method
     *@param {Object} [scope] - optional this object to call callback
     *@returns {boolean}
    */
    every(callback, scope) {
        scope = Util.isObject(scope)? scope : null;
        return this.length > 0 && this.items.every(callback, scope);
    }

    /**
     * tests whether one or more items in the queue pass the test implemented by the callback function
     *@param {Function} callback - the callback method
     *@param {Object} [scope] - optional this object to call callback
     *@returns {boolean}
    */
    some(callback, scope) {
        scope = Util.isObject(scope)? scope : null;
        return this.length > 0 && this.items.some(callback, scope);
    }

    /**
     * returns an array with the result of calling the provided callback on every item in the
     * queue.
     *@param {Function} callback - the callback method
     *@param {Object} [scope] - optional this object to call callback
     *@returns {Array}
    */
    map(callback, scope) {
        scope = Util.isObject(scope)? scope : null;
        return this.items.map(callback, scope);
    }

    /**
     * reduces the items in the queue to an accumulation by calling each item on the given callback.
     *@param {Function} callback - the callback method
     *@param {Object} [initialValue] - optional initial value to use as accumulator
     *@returns {Queue}
    */
    reduce(callback, initialValue) {
        if (Util.isValidParameter(initialValue))
            return this.items.reduce(callback, initialValue);
        else
            return this.items.reduce(callback);
    }

    /**
     * creates a new queue with all items that pass the test implemented by the provided
     * callback function
     *@param {Function} callback - the callback method
     *@param {Object} [scope] - optional this object to call callback
     *@returns {Queue}
    */
    filter(callback, scope) {
        scope = Util.isObject(scope)? scope : null;
        return this.cloneWith(this.items.filter(callback, scope));
    }
}