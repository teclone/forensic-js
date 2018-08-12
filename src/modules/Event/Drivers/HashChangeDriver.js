/**
 *@namespace EventDrivers
*/

/**
 * event initialization options.
 *@typedef {Object} HashChangeEventInit
 *@property {boolean} [HashChangeEventInit.bubbles=true] - boolean value indicating if event bubbles
 *@property {boolean} [HashChangeEventInit.cancelable=false] - boolean value indicating if event is
 * cancelable
 *@property {string} [HashChangeEventInit.oldURL=''] - represent the old url
 *@property {string} [eventInit.newURL=''] - represent the new url
*/
import {createDOMEvent} from '../../Globals.js';
import Driver from './Driver.js';

/**
 * hashchange event driver class
 *@memberof EventDrivers
 *@see {@link https://html.spec.whatwg.org/multipage/browsing-the-web.html#hashchangeevent| W3.org}
*/
export default class HashChangeDriver extends Driver {
    /**
     * event types in the hashchange event interface
     *@type {Array}
    */
    static get events() {
        return ['hashchange'];
    }

    /**
     * event init keys
     *@type {Array}
    */
    static get eventInitKeys() {
        let keys = Driver.eventInitKeys;

        keys.push('oldURL', 'newURL');
        return keys;
    }

    /**
     * initializes the event according to the HashChangeEvent interface eventInit requirement
     *@param {Object} storeIn - object in which to store initializations
     *@param {HashChangeEventInit} getFrom - event initialization objects
     *@returns {Object}
    */
    static initEvent(storeIn, getFrom) {
        Driver.initEvent(storeIn, getFrom);

        storeIn.oldURL = typeof getFrom.oldURL === 'string'? getFrom.oldURL : '';
        storeIn.newURL = typeof getFrom.newURL === 'string'? getFrom.newURL : '';

        return storeIn;
    }

    /**
     * creates a HashChangeEvent object that can be dispatched to an event target
     *@param {string} type - the event type
     *@param {HashChangeEventInit} eventInit - event initialization object
     *@returns {HashChangeEvent}
    */
    static create(type, eventInit) {
        return createDOMEvent(
            'HashChangeEvent', type, this.initEvent({}, eventInit), this.eventInitKeys
        );
    }

    /**
     *@param {HashChangeEvent} event - the dispatched event object
    */
    constructor(event) {
        super(event);
    }

    /**
     *@type {string}
    */
    get [Symbol.toStringTag]() {
        return 'HashChangeDriver';
    }

    /**
     * the old Url value
     *@type {string}
    */
    get oldURL() {
        return this.event.oldURL;
    }

    /**
     * the new Url value
     *@type {string}
    */
    get newURL() {
        return this.event.newURL;
    }
}