/**
 *@module WheelDriver
 *@memberof EventDrivers
*/

/**
 * event initialization options.
 *@typedef {Object} WheelEventInit
 *@private
 *@property {boolean} [bubbles=true] - boolean value indicating if event bubbles
 *@property {boolean} [cancelable=false] - boolean value indicating if event is
 * cancelable
 *@property {WindowProxy} [view=null] - identifies the window from which the event was generated.
 *@property {number} [detail=0] - value is initialized to a number that is application-specific.
 *@property {long} [screenX=0] - initializes the X cordinate of the mouse in
 * relation to the device physical screen
 *@property {long} [screenY=0] - initializes the Y cordinate of the mouse in
 * relation to the device physical screen
 *@property {long} [clientX=0] - initializes the X cordinate of the mouse in
 * relation to the browser viewport
 *@property {long} [clientY=0] - initializes the Y cordinate of the mouse in
 * relation to the browser viewport
 *@property {boolean} [ctrlKey=false] - boolean indicating if the control key
 * was active during the event initiation
 *@property {boolean} [altKey=false] - boolean indicating if the alternate key
 * was active during the event initiation
 *@property {boolean} [shiftKey=false] - boolean indicating if the shift key
 * was active during the event initiation
 *@property {boolean} [metaKey=false] - boolean indicating if the meta key
 * was active during the event initiation
 *@property {short} [button=0] - initializes the button that was pressed. 0 represents
 * left button, 1 is wheel button, 2 is right button
 *@property {EventTarget} [relatedTarget=null] - initializes the secondary EventTarget
 * related to a Focus event, depending on the type of event.
 *@property {double} [deltaX=0] - event delta cordinate in the X direction
 *@property {double} [deltaY=0] - event delta cordinate in the Y direction
 *@property {double} [deltaZ=0] - event delta cordinate in the Z direction
 *@property {long} [deltaMode=0] - deltaMode value
*/
import {createDOMEvent} from '../../Globals.js';
import MouseDriver from './MouseDriver.js';
import Util from '../../Util.js';

/**
 * wheel event driver class
 *@memberof EventDrivers.WheelDriver#
 *@see {@link https://www.w3.org/TR/uievents/#events-wheelevents| W3C.org}
*/
export default class WheelDriver extends MouseDriver {
    /**
     * event types in the wheel event interface
     *@memberof EventDrivers.WheelDriver
     *@type {Array}
    */
    static get events() {
        return [
            'wheel'
        ];
    }

    /**
     * event init keys
     *@memberof EventDrivers.WheelDriver
     *@type {Array}
    */
    static get eventInitKeys() {
        let keys = MouseDriver.eventInitKeys;

        keys.push(
            'deltaX', 'deltaY', 'deltaZ', 'deltaMode'
        );
        return keys;
    }

    /**
     * initializes the event according to the WheelEvent interface eventInit requirement
     *@memberof EventDrivers.WheelDriver
     *@param {Object} storeIn - object in which to store initializations
     *@param {WheelEventInit} getFrom - event initialization objects
     *@returns {Object}
    */
    static initEvent(storeIn, getFrom) {
        MouseDriver.initEvent(storeIn, getFrom);

        storeIn.deltaX = Util.isNumber(getFrom.deltaX)? getFrom.deltaX : 0.0;
        storeIn.deltaY = Util.isNumber(getFrom.deltaY)? getFrom.deltaY : 0.0;
        storeIn.deltaZ = Util.isNumber(getFrom.deltaZ)? getFrom.deltaZ : 0.0;

        storeIn.deltaMode = Util.isNumber(getFrom.deltaMode)? getFrom.deltaMode : 0;

        return storeIn;
    }

    /**
     * creates a WheelEvent object that can be dispatched to an event target
     *@memberof EventDrivers.WheelDriver
     *@param {string} type - the event type
     *@param {WheelEventInit} eventInit - event initialization object
     *@returns {WheelEvent}
    */
    static create(type, eventInit) {
        return createDOMEvent(
            'WheelEvent', type, this.initEvent({}, eventInit), this.eventInitKeys
        );
    }

    /**
     *@param {WheelEvent} event - the dispatched event object
    */
    constructor(event) {
        super(event);
    }

    /**
     *@type {string}
     *@memberof EventDrivers.WheelDriver#
     *@private
    */
    get [Symbol.toStringTag]() {
        return 'WheelDriver';
    }

    /**
     * In user agents where the default action of the wheel event is to scroll,
     * the value MUST be the measurement along the x-axis (in pixels, lines, or pages) to be scrolled
     * in the case where the event is not cancelled. Otherwise,
     * this is an implementation-specific measurement (in pixels, lines, or pages) of the
     * movement of a wheel device around the x-axis.
     *@memberof EventDrivers.WheelDriver#
     *@type {float}
    */
    get deltaX() {
        return this.event.deltaX;
    }

    /**
     * In user agents where the default action of the wheel event is to scroll,
     * the value MUST be the measurement along the y-axis (in pixels, lines, or pages) to be scrolled
     * in the case where the event is not cancelled. Otherwise,
     * this is an implementation-specific measurement (in pixels, lines, or pages) of the
     * movement of a wheel device around the t-axis.
     *@memberof EventDrivers.WheelDriver#
     *@type {float}
    */
    get deltaY() {
        return this.event.deltaY;
    }

    /**
     * In user agents where the default action of the wheel event is to scroll,
     * the value MUST be the measurement along the z-axis (in pixels, lines, or pages) to be scrolled
     * in the case where the event is not cancelled. Otherwise,
     * this is an implementation-specific measurement (in pixels, lines, or pages) of the
     * movement of a wheel device around the z-axis.
     *@memberof EventDrivers.WheelDriver#
     *@type {float}
    */
    get deltaZ() {
        return this.event.deltaZ;
    }

    /**
     * The deltaMode attribute contains an indication of the units of measurement for the delta values.
     * The default value is DOM_DELTA_PIXEL (pixels). others are DOM_DELTA_LINE
     * and DOM_DELTA_PAGE
     *@memberof EventDrivers.WheelDriver#
     *@type {long}
    */
    get deltaMode() {
        return this.event.deltaMode;
    }
}