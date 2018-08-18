/**
 *@module PageTransitionDriver
 *@memberof EventDrivers
*/

/**
 * event initialization options.
 *@typedef {Object} PageTransitionEventInit
 *@private
 *@property {boolean} [bubbles=true] - boolean value indicating if event bubbles
 *@property {boolean} [cancelable=false] - boolean value indicating if event is
 * cancelable
 *@property {boolean} [persisted=false] - boolean property
*/
import {createDOMEvent, onInstall, host} from '../../Globals.js';
import Driver from './Driver.js';
import PageTransitionEventPollyfill from '../Pollyfills/PageTransitionEventPollyfill.js';

/**
 * Page transition event driver class
 *@memberof EventDrivers.PageTransitionDriver#
 *@see {@link https://html.spec.whatwg.org/multipage/browsing-the-web.html#pagetransitionevent| W3.org}
*/
export default class PageTransitionDriver extends Driver {
    /**
     * event types in the Page transition event interface
     *@memberof EventDrivers.PageTransitionDriver
     *@type {Array}
    */
    static get events() {
        return ['pageshow', 'pagehide'];
    }

    /**
     * event init keys
     *@memberof EventDrivers.PageTransitionDriver
     *@type {Array}
    */
    static get eventInitKeys() {
        let keys = Driver.eventInitKeys;

        keys.push('persisted');
        return keys;
    }

    /**
     * initializes the event according to the PageTransitionEvent interface eventInit requirement
     *@memberof EventDrivers.PageTransitionDriver
     *@param {Object} storeIn - object in which to store initializations
     *@param {PageTransitionEventInit} getFrom - event initialization objects
     *@returns {Object}
    */
    static initEvent(storeIn, getFrom) {
        Driver.initEvent(storeIn, getFrom);

        storeIn.persisted = getFrom.persisted? true : false;

        return storeIn;
    }

    /**
     * creates a PageTransitionEvent object that can be dispatched to an event target
     *@memberof EventDrivers.PageTransitionDriver
     *@param {string} type - the event type
     *@param {PageTransitionEventInit} eventInit - event initialization object
     *@returns {PageTransitionEvent}
    */
    static create(type, eventInit) {
        return createDOMEvent(
            'PageTransitionEvent', type, this.initEvent({}, eventInit), this.eventInitKeys
        );
    }

    /**
     *@param {PageTransitionEvent} event - the dispatched event object
    */
    constructor(event) {
        super(event);
    }

    /**
     *@memberof EventDrivers.PageTransitionDriver#
     *@private
     *@type {string}
    */
    get [Symbol.toStringTag]() {
        return 'PageTransitionDriver';
    }

    /**
     * a boolean value indicating if the webpage is loading from cache
     *@memberof EventDrivers.PageTransitionDriver#
     *@type {boolean}
    */
    get persisted() {
        return this.event.persisted;
    }
}

/* install pollyfill */
onInstall(function() {
    PageTransitionEventPollyfill.install(host, PageTransitionDriver.initEvent);
});