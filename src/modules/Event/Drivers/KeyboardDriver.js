/**
 *@module KeyboardDriver
 *@memberof EventDrivers
*/

/**
 * event initialization options.
 *@typedef {Object} KeyboardEventInit
 *@private
 *@see {@link https://www.w3.org/TR/uievents-code/} for list of keyboard code values
 *@see {@link https://www.w3.org/TR/uievents-key/} for list of keyboard key values
 *
 *@property {boolean} [bubbles=true] - boolean value indicating if event bubbles
 *@property {boolean} [cancelable=false] - boolean value indicating if event is
 * cancelable
 *@property {WindowProxy} [view=null] - identifies the window from which the event was generated.
 *@property {number} [detail=0] - value is initialized to a number that is application-specific.
 *@property {boolean} [isComposing=false] - indicates if the event being
 * constructed occurs as part of a composition sequence
 *@property {boolean} [repeat=false] - indicates if event occurs as part of
 * a repeating sequence of KeyboardEvent caused by long depression of a single key
 *@property {long} [location=0] - The location of the key in the board layout
 *@property {string} [key=''] - the final key value of the event. if it is not
 * a printable character, then it should be part of the UIEvent-keys as defined.
 *@property {string} [code=''] - the unicode character for the key pressed.
 * value should be one of
*/
import {createDOMEvent} from '../../Globals.js';
import UIDriver from './UIDriver.js';
import Util from '../../Util.js';

//resolve key implementations across browsers. MDN reports that IE9 uses Win and Scroll
const MODIFIER_KEYS = {
    'OS': ['OS', 'Win'],
    'ScrollLock': ['Scroll', 'ScrollLock']
};

/**
 * keyboard event driver class
 *@memberof EventDrivers.KeyboardDriver#
 *@see {@link https://www.w3.org/TR/uievents/#events-keyboardevents| W3C.org}
*/
export default class KeyboardDriver extends UIDriver {
    /**
     * event types in the mouse event interface
     *@memberof EventDrivers.KeyboardDriver
     *@type {Array}
    */
    static get events() {
        return [
            'keyup', 'keydown', 'keypress'
        ];
    }

    /**
     * event init keys
     *@memberof EventDrivers.KeyboardDriver
     *@type {Array}
    */
    static get eventInitKeys() {
        let keys = UIDriver.eventInitKeys;

        //remove the detail property
        keys.pop();

        keys.push('code', 'key', 'location', {ctrlKey: 'Control', altKey: 'Alt',
            shiftKey: 'Shift', metaKey: 'Meta'}
        );
        return keys;
    }

    /**
     * initializes the event according to the Keyboard interface eventInit requirement
     *@memberof EventDrivers.KeyboardDriver
     *@param {Object} storeIn - object in which to store initializations
     *@param {KeyboardEventInit} getFrom - event initialization objects
     *@returns {Object}
    */
    static initEvent(storeIn, getFrom) {
        UIDriver.initEvent(storeIn, getFrom);


        storeIn.key = typeof getFrom.key !== 'undefined'? getFrom.key.toString() : '';
        storeIn.code = typeof getFrom.code !== 'undefined'? getFrom.code.toString() : '';

        storeIn.isComposing = getFrom.isComposing? true : false;
        storeIn.repeat = getFrom.repeat? true : false;

        storeIn.location = Util.isNumber(getFrom.location)? getFrom.location : 0;

        return storeIn;
    }

    /**
     * creates a Keyboard event that can be dispatched to an event target
     *@memberof EventDrivers.KeyboardDriver
     *@param {string} type - the event type
     *@param {KeyboardEventInit} eventInit - event initialization object
     *@returns {Keyboard}
    */
    static create(type, eventInit) {
        return createDOMEvent(
            'KeyboardEvent', type, this.initEvent({}, eventInit), this.eventInitKeys
        );
    }

    /**
     *@param {Keyboard} event - the dispatched event object
    */
    constructor(event) {
        super(event);
    }

    /**
     *@type {string}
     *@memberof EventDrivers.KeyboardDriver#
     *@private
    */
    get [Symbol.toStringTag]() {
        return 'KeyboardDriver';
    }

    /**
     * boolean value indicating the control key is activated by the event
     *@memberof EventDrivers.KeyboardDriver#
     *@type {boolean}
    */
    get ctrlKey() {
        return this.event.ctrlKey;
    }

    /**
     * boolean value indicating the shift key is activated by the event
     *@memberof EventDrivers.KeyboardDriver#
     *@type {boolean}
    */
    get shiftKey() {
        return this.event.shiftKey;
    }

    /**
     * boolean value indicating the meta key is activated by the event
     *@memberof EventDrivers.KeyboardDriver#
     *@type {boolean}
    */
    get metaKey() {
        return this.event.metaKey;
    }

    /**
     * boolean value indicating the alternate key is activated by the event
     *@memberof EventDrivers.KeyboardDriver#
     *@type {boolean}
    */
    get altKey() {
        return this.event.altKey;
    }

    /**
     * key holds the key value of the key pressed, with considerations on the key modifier
     * states and keyboard layout/locale
     *@memberof EventDrivers.KeyboardDriver#
     *@type {string}
    */
    get key() {
        return this.event.key;
    }

    /**
     * code holds a string that identifies the physical key being pressed. The value is not
     * affected by the current keyboard layout or modifier state, so a particular key will
     * always return the same value.
     *@memberof EventDrivers.KeyboardDriver#
     *@type {string}
    */
    get code() {
        return this.event.code;
    }

    /**
     * true if the keyboard event occurs as part of a composition session, i.e., after a
     * compositionstart event and before the corresponding compositionend event
     *@memberof EventDrivers.KeyboardDriver#
     *@type {boolean}
    */
    get isComposing() {
        return this.event.isComposing;
    }

    /**
     * true if the keyboard event is repeating
     *@memberof EventDrivers.KeyboardDriver#
     *@type {boolean}
    */
    get repeat() {
        return this.event.repeat;
    }

    /**
     * returns the key location in the keyboard. it is one of
     * DOM_KEY_LOCATION_STANDARD, DOM_KEY_LOCATION_LEFT, DOM_KEY_LOCATION_RIGHT
     * DOM_KEY_LOCATION_NUMPAD
     *@memberof EventDrivers.KeyboardDriver#
     *@returns {Long}
    */
    get location() {
        return this.event.location;
    }

    /**
     * returns boolean value indicating if the passed in modifier key was active
     *@memberof EventDrivers.KeyboardDriver#
     *@param {string} keyArg - the modifier key to check
     *@returns {boolean}
    */
    getModifierState(keyArg) {
        //if the key has some discrepancies in browsers, then resolve it
        if (typeof MODIFIER_KEYS[keyArg] !== 'undefined')
            keyArg = MODIFIER_KEYS[keyArg];
        else
            keyArg = [keyArg];

        return keyArg.some((key) => this.event.getModifierState(key));
    }
}