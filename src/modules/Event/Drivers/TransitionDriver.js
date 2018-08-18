/**
 *@module TransitionDriver
 *@memberof EventDrivers
*/

/**
 * event initialization options.
 *@typedef {Object} TransitionEventInit
 *@private
 *@property {boolean} [bubbles=true] - boolean value indicating if event bubbles
 *@property {boolean} [cancelable=false] - boolean value indicating if event is cancelable
 *@property {string} [propertyName=''] - transition property name
 *@property {float} [elapsedTime=0.0] - transition elapsed time
 *@property {string} [pseudoElement=''] - transition pseudo element
*/

import {createDOMEvent, onInstall, host} from '../../Globals.js';
import Util from '../../Util.js';
import Driver from './Driver.js';
import TransitionEventPollyfill from '../Pollyfills/TransitionEventPollyfill.js';

/**
 * transition event driver class
 *@memberof EventDrivers.TransitionDriver#
 *@see {@link https://developer.mozilla.org/en-US/docs/Web/API/TransitionEvent| Mozilla Developers Network}
*/
export default class TransitionDriver extends Driver {
    /**
     * event types in the transition event interface
     *@memberof EventDrivers.TransitionDriver
     *@type {Array}
    */
    static get events() {
        return ['transitionrun', 'transitionstart', 'transitionend', 'transitioncancel'];
    }

    /**
     * event init keys
     *@memberof EventDrivers.TransitionDriver
     *@type {Array}
    */
    static get eventInitKeys() {
        let keys = Driver.eventInitKeys;

        keys.push('propertyName', 'elapsedTime');
        return keys;
    }

    /**
     * initializes the event according to the TransitionEvent interface eventInit requirement
     *@memberof EventDrivers.TransitionDriver
     *@param {Object} storeIn - object in which to store initializations
     *@param {TransitionEventInit} getFrom - event initialization objects
     *@returns {Object}
    */
    static initEvent(storeIn, getFrom) {
        Driver.initEvent(storeIn, getFrom);

        storeIn.propertyName = typeof getFrom.propertyName === 'string'?
            getFrom.propertyName : '';
        storeIn.elapsedTime = Util.isNumber(getFrom.elapsedTime)?
            getFrom.elapsedTime : 0.0;
        storeIn.pseudoElement = typeof getFrom.pseudoElement === 'string'?
            getFrom.pseudoElement : '';

        return storeIn;
    }

    /**
     * creates an TransitionEvent object that can be dispatched to an event target
     *@memberof EventDrivers.TransitionDriver
     *@param {string} type - the event type
     *@param {TransitionEventInit} eventInit - event initialization object.
     *@returns {TransitionEvent}
    */
    static create(type, eventInit) {
        return createDOMEvent(
            'TransitionEvent', type, this.initEvent({}, eventInit), this.eventInitKeys
        );
    }

    /**
     *@param {Object} event - the event object
    */
    constructor(event) {
        super(event);
    }

    /**
     *@type {string}
     *@memberof EventDrivers.TransitionDriver#
     *@private
    */
    get [Symbol.toStringTag]() {
        return 'TransitionDriver';
    }

    /**
     * the css name property associated with the transition. it is always empty string
     *@memberof EventDrivers.TransitionDriver#
     *@type {string}
    */
    get propertyName() {
        return this.event.propertyName;
    }

    /**
     * the elapsed time associated with the animation in seconds
     *@memberof EventDrivers.TransitionDriver#
     *@type {float}
    */
    get elapsedTime() {
        return this.event.elapsedTime;
    }

    /**
     * a string starting with '::', containing the name of the pseudo-element the
     * animation runs on. If the transition doesn't run on a pseudo-element but on the element,
     * an empty string is returned
     *@memberof EventDrivers.TransitionDriver#
     *@type {string}
    */
    get pseudoElement() {
        return this.event.pseudoElement;
    }
}

/* install pollyfill */
onInstall(function() {
    TransitionEventPollyfill.install(host, TransitionDriver.initEvent);
});