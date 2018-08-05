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
import Util from '../Util.js';

/**
 * base event driver class
 *@memberof EventDrivers
 *@see {@link https://developer.mozilla.org/en-US/docs/Web/API/Event| Mozilla Developers Network}
*/
export default class Driver {
    /**
     * event types in the base Event interface
     *@type {Array}
    */
    static get events() {
        return [
            'afterprint', 'audioend', 'audiostart', 'beforeprint', 'cached', 'canplay',
            'canplaythrough', 'change', 'chargingchange', 'chargingtimechange', 'checking',
            'close', 'dischargingtimechange', 'DOMContentLoaded', 'downloading', 'durationchange',
            'emptied', 'end', 'ended', 'fullscreenchange', 'fullscreenerror', 'languagechange',
            'loadeddata', 'loadedmetadata', 'noupdate', 'obsolete', 'offline', 'online', 'open',
            'orientationchange', 'pause', 'play', 'playing', 'ratechange', 'readystatechange',
            'reset', 'seeked', 'seeking', 'selectstart', 'selectionchange', 'soundend',
            'soundstart', 'stalled', 'start', 'submit', 'success', 'suspend', 'timeupdate',
            'updateready', 'volumechange', 'waiting'
        ];
    }

    /**
     * initializes the event according to the Event interface eventInit requirement
     *@param {Object} storeIn - object in which to store initializations
     *@param {eventInit} getFrom - event initialization objects
     *@returns {Object}
    */
    static initEvent(storeIn, getFrom) {
        storeIn.bubbles = typeof getFrom.bubbles !== 'undefined' && !getFrom.bubbles? false : true;
        storeIn.cancelable = typeof getFrom.cancelable !== 'undefined' && !getFrom.cancelable? false : true;
        return storeIn;
    }

    /**
     * creates an Event object that can be dispatched to an event target
     *@param {string} type - the event type
     *@param {eventInit} eventInit - event initialization object
     *@returns {Event}
    */
    static create(type, eventInit) {
        return new host.Event(type, this.initEvent({}, eventInit));
    }

    /**
     *@param {Event} event - the dispatched event object
    */
    constructor(event) {
        this.event = event;
        this._currentTarget = null;
        this._isPropagating = true;
        this._phase = 1;
        this._passive = false;
    }

    /**
     *@type {string}
    */
    get [Symbol.toStringTag]() {
        return 'Driver';
    }

    /**
     * the event type
     *@type {string}
    */
    get type() {
        return this.event.type;
    }

    /**
     * the event target
     *@type {EventTarget}
    */
    get target() {
        return this.event.target;
    }

    /**
     * gets the current target whose event listener's callback is being invoked
     *@type {EventTarget}
    */
    get currentTarget() {
        return this._currentTarget || this.event.currentTarget;
    }

    /**
     * sets the current target whose event listener's callback is being invoked.
     *
     *@param {EventTarget} target - the current event target
    */
    set currentTarget(target) {
        if (Util.isEventTarget(target))
            this._currentTarget = target;
    }

    /**
     * returns boolean indicating if it is passive event
     *@type {boolean}
    */
    get passive() {
        return this._passive;
    }

    /**
     * sets boolean property indicating if it passive event.
     *
     *@param {boolean} status - the status
    */
    set passive(status) {
        this._passive = status? true : false;
    }

    /**
     * the event phase
     *@type {number}
    */
    get phase() {
        return this._phase;
    }

    /**
     * sets event phase
     *
     *@param {number} value - the event phase
     *@returns {boolean}
    */
    set phase(value) {
        switch(value) {
            case 0:
            case 1:
            case 2:
                this._phase = value;
                break;
            default:
                this._phase = 3;
                break;
        }
    }

    /**
     * boolean value indicating if event bubbles
     *@type {boolean}
    */
    get bubbles() {
        return this.event.bubbles;
    }

    /**
     * boolean value indicating if event was dispatched by the user agent, and false otherwise.
     *@type {boolean}
    */
    get isTrusted() {
        return this.event.isTrusted;
    }

    /**
     * boolean value indicating if event default action has been prevented
     *@type {boolean}
    */
    get defaultPrevented() {
        return this.event.defaultPrevented;
    }

    /**
     * boolean value indicating if event is still propagating
     *@type {boolean}
    */
    get isPropagating() {
        return this._isPropagating;
    }

    /**
     * the creation time of event as the number of milliseconds that passed since
     * 00:00:00 UTC on 1 January 1970.
     *@type {number}
    */
    get timestamp() {
        return this.event.timeStamp;
    }

    /**
     * stops the event from propagating.
    */
    stopPropagation() {
        this.event.stopPropagation();
        this._isPropagating = false;
    }

    /**
     * prevents the events default.
    */
    preventDefault() {
        if (this.passive)
            console.error('Unable to preventDefault inside passive event listener');

        else if (!this.defaultPrevented)
            this.event.preventDefault();
    }
}