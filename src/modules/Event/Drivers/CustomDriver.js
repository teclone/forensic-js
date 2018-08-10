/**
 *@namespace EventDrivers
*/

/**
 * event initialization options.
 *@typedef {Object} EventInit
 *@property {boolean} [EventInit.bubbles=true] - boolean value indicating if event bubbles
 *@property {boolean} [EventInit.cancelable=false] - boolean value indicating if event is
 * cancelable
 *@property {mixed} [EventInit.detail=null] - the custom event detail
*/
import {createDOMEvent} from '../../Globals.js';
import Driver from './Driver.js';

/**
 * custom event driver class
 *@memberof EventDrivers
 *@see {@link https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent| Mozilla Developers Network}
*/
export default class CustomDriver extends Driver {
    /**
     * event types in the custom event interface
     *@type {Array}
    */
    static get events() {
        return [];
    }

    /**
     * event init keys
     *@type {Array}
    */
    static get eventInitKeys() {
        let keys = Driver.eventInitKeys;

        keys.push('detail');
        return keys;
    }

    /**
     * initializes the event according to the CustomEvent interface eventInit requirement
     *@param {Object} storeIn - object in which to store initializations
     *@param {EventInit} getFrom - event initialization objects
     *@param {mixed} [detail=null] - the custom event data
     *@returns {Object}
    */
    static initEvent(storeIn, getFrom, detail) {
        Driver.initEvent(storeIn, getFrom);
        storeIn.detail = typeof detail === 'undefined'? null : detail;
        return storeIn;
    }

    /**
     * creates a CustomEvent object that can be dispatched to an event target
     *@param {string} type - the event type
     *@param {EventInit} eventInit - event initialization object
     *@param {mixed} [detail=null] - the custom event data
     *@returns {CustomEvent}
    */
    static create(type, eventInit, detail) {
        return createDOMEvent(
            'CustomEvent', type, this.initEvent({}, eventInit, detail), this.eventInitKeys
        );
    }

    /**
     *@param {CustomEvent} event - the dispatched event object
    */
    constructor(event) {
        super(event);
    }

    /**
     *@type {string}
    */
    get [Symbol.toStringTag]() {
        return 'CustomDriver';
    }

    /**
     * Returns any custom data event was created with. Typically used for synthetic events.
     *@returns {*}
    */
    get detail() {
        return this.event.detail;
    }
}