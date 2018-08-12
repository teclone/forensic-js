/**
 *@namespace EventDrivers
*/

/**
 * event initialization options.
 *@typedef {Object} TouchEventInit
 *@property {boolean} [TouchEventInit.bubbles=true] - boolean value indicating if event bubbles
 *@property {boolean} [TouchEventInit.cancelable=false] - boolean value indicating if event is
 * cancelable
 *@property {Array} [TouchEventInit.touches=[]] - array of touch points currently touching the
 * surface
 *@property {Array} [TouchEventInit.targetTouches=[]] - array of touch points currently touching
 * the target element
 *@property {Array} [TouchEventInit.changedTouches=[]] - array of touch points that has changed
 * since the last touch event
*/
import {createDOMEvent} from '../../Globals.js';
import UIDriver from './UIDriver.js';
import Util from '../../Util.js';

/**
 * touch event event driver class
 *@memberof EventDrivers
 *@see {@link https://w3c.github.io/touch-events/#touch-interface| W3.org}
*/
export default class TouchDriver extends UIDriver {
    /**
     * event types in the touch event event interface
     *@type {Array}
    */
    static get events() {
        return ['touchstart', 'touchmove', 'touchend', 'touchcancel'];
    }

    /**
     * event init keys
     *@type {Array}
    */
    static get eventInitKeys() {
        let keys = UIDriver.eventInitKeys;

        keys.push('touches', 'targetTouches', 'changedTouches');
        return keys;
    }

    /**
     * initializes the event according to the TouchEvent interface eventInit requirement
     *@param {Object} storeIn - object in which to store initializations
     *@param {TouchEventInit} getFrom - event initialization objects
     *@returns {Object}
    */
    static initEvent(storeIn, getFrom) {
        UIDriver.initEvent(storeIn, getFrom);

        storeIn.touches = Util.isArray(getFrom.touches)? getFrom.touches : [];
        storeIn.targetTouches = Util.isArray(getFrom.targetTouches)? getFrom.targetTouches : [];
        storeIn.changedTouches = Util.isArray(getFrom.changedTouches)? getFrom.changedTouches : [];

        return storeIn;
    }

    /**
     * creates a TouchEvent object that can be dispatched to an event target
     *@param {string} type - the event type
     *@param {TouchEventInit} eventInit - event initialization object
     *@returns {TouchEvent}
    */
    static create(type, eventInit) {
        return createDOMEvent(
            'TouchEvent', type, this.initEvent({}, eventInit), this.eventInitKeys
        );
    }

    /**
     *@param {TouchEvent} event - the dispatched event object
    */
    constructor(event) {
        super(event);
    }

    /**
     *@type {string}
    */
    get [Symbol.toStringTag]() {
        return 'TouchDriver';
    }

    /**
     * sequence of touch points currently touching the touch surface
     *@type {TouchList}
    */
    get touches() {
        return this.event.touches;
    }

    /**
     * sequence of touch points currently touching the target touch surface
     *@type {TouchList}
    */
    get targetTouches() {
        return this.event.targetTouches;
    }

    /**
     * sequence of touch points that has changed since the last touch event
     *@type {TouchList}
    */
    get changedTouches() {
        return this.event.changedTouches;
    }

    /**
     * boolean value indicating the control key is activated by the event
     *@type {boolean}
    */
    get ctrlKey() {
        return this.event.ctrlKey;
    }

    /**
     * boolean value indicating the shift key is activated by the event
     *@type {boolean}
    */
    get shiftKey() {
        return this.event.shiftKey;
    }

    /**
     * boolean value indicating the meta key is activated by the event
     *@type {boolean}
    */
    get metaKey() {
        return this.event.metaKey;
    }

    /**
     * boolean value indicating the alternate key is activated by the event
     *@type {boolean}
    */
    get altKey() {
        return this.event.altKey;
    }
}