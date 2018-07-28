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
        //both are equal, return 0
        if (one === two)
            return 0;

        //if both are numbers, return their difference
        if (Util.isNumber(one) && Util.isNumber(two))
            return (one - two) < 0? -1 : 1;

        if (Util.isNumber(one))
            return -1;

        if (Util.isNumber(two))
            return 1;

        //if both are strings
        if (typeof one === 'string' && typeof two === 'string') {
            //convert all to uppercase and sort
            let upOne = one.toUpperCase(),
                upTwo = two.toUpperCase();

            return upOne > upTwo? 1 : -1;
        }

        if (typeof one === 'string')
            return -1;

        if (typeof two === 'string')
            return 1;

        return -1;
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
            //convert to uppercase and check sort in that state
            let upKey = key.toUpperCase(),
                upItem = item.toUpperCase();

            if (!caseSensitive && upKey === upItem)
                return 0;
            else
                return upKey > upItem? 1 : -1;
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
        let items = this.items, index = 0, length = items.length;
        return {
            next() {
                //check if some items have been deleted
                if (items.length < length) {
                    index -= length - items.length;
                    length = items.length;
                }
                if(index < length)
                    return {done: false, value: items[index], index: index++};
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
    getSortFunction(criteria = '') {
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
    getSearchFunction(criteria = '') {
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
    sort(criteria = '') {
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
}