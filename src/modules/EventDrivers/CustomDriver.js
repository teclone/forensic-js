/**
 *@namespace EventDrivers
*/

/**
 * event initialization options.
 *@typedef {Object} eventInit
 *@property {boolean} [eventInit.bubbles=true] - boolean value indicating if event bubbles
 *@property {boolean} [eventInit.cancelable=false] - boolean value indicating if event is
 * cancelable
*/
import {host} from '../Globals.js';
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
     * initializes the event according to the CustomEvent interface eventInit requirement
     *@param {Object} storeIn - object in which to store initializations
     *@param {eventInit} getFrom - event initialization objects
     *@param {*} [detail=null] - custom event data
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
     *@param {eventInit} eventInit - event initialization object
     *@param {*} [detail=null] - custom event data
     *@returns {CustomEvent}
    */
    static create(type, eventInit, detail) {
        return new host.CustomEvent(type, this.initEvent({}, eventInit, detail));
    }

    /**
     *@param {Event} event - the dispatched event object
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