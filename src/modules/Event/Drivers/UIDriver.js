/**
 *@module UIDriver
 *@memberof EventDrivers
*/

/**
 * event initialization options.
 *@typedef {Object} UIEventInit
 *@private
 *@property {boolean} [bubbles=true] - boolean value indicating if event bubbles
 *@property {boolean} [cancelable=false] - boolean value indicating if event is
 * cancelable
 *@property {WindowProxy} [view=null] - identifies the window from which the event was generated.
 *@property {number} [detail=0] - value is initialized to a number that is application-specific.
*/
import {createDOMEvent} from '../../Globals.js';
import Driver from './Driver.js';
import Util from '../../Util.js';

/**
 * ui event driver class
 *@memberof EventDrivers.UIDriver#
 *@see {@link https://www.w3.org/TR/uievents/#events-uievents| W3C.org}
*/
export default class UIDriver extends Driver {
    /**
     * event types in the ui event interface
     *@memberof EventDrivers.UIDriver
     *@type {Array}
    */
    static get events() {
        return ['abort', 'select', 'unload', 'load', 'error', 'scroll', 'unload', 'resize'];
    }

    /**
     * event init keys
     *@memberof EventDrivers.UIDriver#
     *@type {Array}
    */
    static get eventInitKeys() {
        let keys = Driver.eventInitKeys;

        keys.push('view', 'detail');
        return keys;
    }

    /**
     * initializes the event according to the UIEvent interface eventInit requirement
     *@memberof EventDrivers.UIDriver#
     *@param {Object} storeIn - object in which to store initializations
     *@param {UIEventInit} getFrom - event initialization objects
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
     *@memberof EventDrivers.UIDriver#
     *@param {string} type - the event type
     *@param {UIEventInit} eventInit - event initialization object
     *@returns {UIEvent}
    */
    static create(type, eventInit) {
        return createDOMEvent(
            'UIEvent', type, this.initEvent({}, eventInit), this.eventInitKeys
        );
    }

    /**
     *@param {Event} event - the dispatched event object
    */
    constructor(event) {
        super(event);
    }

    /**
     *@memberof EventDrivers.UIDriver#
     *@private
     *@type {string}
    */
    get [Symbol.toStringTag]() {
        return 'UIDriver';
    }

    /**
     * a WindowProxy that contains the view that generated the event.
     *@memberof EventDrivers.UIDriver#
     *@type {WindowProxy}
    */
    get view() {
        return this.event.view;
    }

    /**
     * specifies some detail information about the Event, depending on the type of event.
     *@memberof EventDrivers.UIDriver#
     *@type {number}
    */
    get detail() {
        return this.event.detail;
    }
}