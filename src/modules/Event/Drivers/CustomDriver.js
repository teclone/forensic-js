/**
 *@module CustomDriver
 *@memberof EventDrivers
*/

/**
 * event initialization options.
 *@typedef {Object} CustomEventInit
 *@private
 *@property {boolean} [bubbles=true] - boolean value indicating if event bubbles
 *@property {boolean} [cancelable=false] - boolean value indicating if event is
 * cancelable
 *@property {mixed} [detail=null] - the custom event detail
*/
import {createDOMEvent} from '../../Globals.js';
import Driver from './Driver.js';

/**
 * custom event driver class
 *@memberof EventDrivers.CustomDriver#
 *@see {@link https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent| Mozilla Developers Network}
*/
export default class CustomDriver extends Driver {
    /**
     * event types in the custom event interface
     *@memberof EventDrivers.CustomDriver
     *@type {Array}
    */
    static get events() {
        return [];
    }

    /**
     * event init keys
     *@memberof EventDrivers.CustomDriver
     *@type {Array}
    */
    static get eventInitKeys() {
        let keys = Driver.eventInitKeys;

        keys.push('detail');
        return keys;
    }

    /**
     * initializes the event according to the CustomEvent interface eventInit requirement
     *@memberof EventDrivers.CustomDriver
     *@param {Object} storeIn - object in which to store initializations
     *@param {CustomEventInit} getFrom - event initialization objects
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
     *@memberof EventDrivers.CustomDriver
     *@param {string} type - the event type
     *@param {CustomEventInit} eventInit - event initialization object
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
     *@memberof EventDrivers.CustomDriver#
     *@private
     *@type {string}
    */
    get [Symbol.toStringTag]() {
        return 'CustomDriver';
    }

    /**
     * Returns any custom data event was created with. Typically used for synthetic events.
     *@memberof EventDrivers.CustomDriver#
     *@returns {*}
    */
    get detail() {
        return this.event.detail;
    }
}