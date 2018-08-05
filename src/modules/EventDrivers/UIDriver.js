/**
 *@namespace EventDrivers
*/

/**
 * event initialization options.
 *@typedef {Object} eventInit
 *@property {boolean} [eventInit.bubbles=true] - boolean value indicating if event bubbles
 *@property {boolean} [eventInit.cancelable=false] - boolean value indicating if event is
 * cancelable
 *@param {WindowProxy} [eventInit.view=null] - identifies the window from which the event was generated.
 *@param {number} [eventInit.detail=0] - value is initialized to a number that is application-specific.
*/
import {host} from '../Globals.js';
import Driver from './Driver.js';
import Util from '../Util.js';

/**
 * ui event driver class
 *@memberof EventDrivers
 *@see {@link https://www.w3.org/TR/uievents/#events-uievents| W3C.org}
*/
export default class UIDriver extends Driver {
    /**
     * event types in the ui event interface
     *@type {Array}
    */
    static get events() {
        return ['abort', 'select', 'unload', 'load', 'error', 'scroll', 'unload', 'resize'];
    }

    /**
     * initializes the event according to the UIEvent interface eventInit requirement
     *@param {Object} storeIn - object in which to store initializations
     *@param {eventInit} getFrom - event initialization objects
     *@returns {Object}
    */
    static initEvent(storeIn, getFrom) {
        Driver.initEvent(storeIn, getFrom);

        storeIn.view = Util.isObject(getFrom.view)? getFrom.view : null;
        storeIn.detail = Util.isNumber(getFrom.detail)? getFrom.detail : 0;
        return storeIn;
    }

    /**
     * creates a UIEvent object that can be dispatched to an event target
     *@param {string} type - the event type
     *@param {eventInit} eventInit - event initialization object
     *@returns {UIEvent}
    */
    static create(type, eventInit) {
        return new host.UIEvent(type, this.initEvent({}, eventInit));
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
        return 'UIDriver';
    }

    /**
     * a WindowProxy that contains the view that generated the event.
     *@type {WindowProxy}
    */
    get view() {
        return this.event.view;
    }

    /**
     * specifies some detail information about the Event, depending on the type of event.
     *@type {number}
    */
    get detail() {
        return this.event.detail;
    }
}