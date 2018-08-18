/**
 *@module PopStateDriver
 *@memberof EventDrivers
*/

/**
 * event initialization options.
 *@typedef {Object} PopStateEventInit
 *@private
 *@property {boolean} [bubbles=true] - boolean value indicating if event bubbles
 *@property {boolean} [cancelable=false] - boolean value indicating if event is
 * cancelable
 *@property {*} [state=null] - the document state as passed in by
 * pushState or replaceState
*/
import {createDOMEvent} from '../../Globals.js';
import Driver from './Driver.js';

/**
 * popstate event driver class
 *@memberof EventDrivers.PopStateDriver#
 *@see {@link https://html.spec.whatwg.org/multipage/browsing-the-web.html#popstateevent| W3.org}
*/
export default class PopStateDriver extends Driver {
    /**
     * event types in the popstate event interface
     *@memberof EventDrivers.PopStateDriver
     *@type {Array}
    */
    static get events() {
        return ['popstate'];
    }

    /**
     * event init keys
     *@memberof EventDrivers.PopStateDriver
     *@type {Array}
    */
    static get eventInitKeys() {
        let keys = Driver.eventInitKeys;

        keys.push('state');
        return keys;
    }

    /**
     * initializes the event according to the PopStateEvent interface eventInit requirement
     *@memberof EventDrivers.PopStateDriver
     *@param {Object} storeIn - object in which to store initializations
     *@param {PopStateEventInit} getFrom - event initialization objects
     *@returns {Object}
    */
    static initEvent(storeIn, getFrom) {
        Driver.initEvent(storeIn, getFrom);

        storeIn.state = getFrom.state? getFrom.state : null;

        return storeIn;
    }

    /**
     * creates a PopStateEvent object that can be dispatched to an event target
     *@memberof EventDrivers.PopStateDriver
     *@param {string} type - the event type
     *@param {PopStateEventInit} eventInit - event initialization object
     *@returns {PopStateEvent}
    */
    static create(type, eventInit) {
        return createDOMEvent(
            'PopStateEvent', type, this.initEvent({}, eventInit), this.eventInitKeys
        );
    }

    /**
     *@param {PopStateEvent} event - the dispatched event object
    */
    constructor(event) {
        super(event);
    }

    /**
     *@memberof EventDrivers.PopStateDriver#
     *@private
     *@type {string}
    */
    get [Symbol.toStringTag]() {
        return 'PopStateDriver';
    }

    /**
     * the event state
     *@memberof EventDrivers.PopStateDriver#
     *@type {*}
    */
    get state() {
        return this.event.state;
    }
}