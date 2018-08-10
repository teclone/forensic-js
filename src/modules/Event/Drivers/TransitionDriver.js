/**
 *@namespace EventDrivers
*/

/**
 * event initialization options.
 *@typedef {Object} TransitionEventInit
 *@property {boolean} [TransitionEventInit.bubbles=true] - boolean value indicating if event bubbles
 *@property {boolean} [TransitionEventInit.cancelable=false] - boolean value indicating if event is cancelable
 *@property {string} [TransitionEventInit.propertyName=''] - transition property name
 *@property {float} [TransitionEventInit.elapsedTime=0.0] - transition elapsed time
 *@property {string} [TransitionEventInit.pseudoElement=''] - transition pseudo element
*/

import {createDOMEvent, onInstall, host} from '../../Globals.js';
import Util from '../../Util.js';
import Driver from './Driver.js';
import TransitionEventPollyfill from '../Pollyfills/TransitionEventPollyfill.js';

/**
 * transition event driver class
 *@memberof EventDrivers
 *@see {@link https://developer.mozilla.org/en-US/docs/Web/API/TransitionEvent| Mozilla Developers Network}
*/
export default class TransitionDriver extends Driver {
    /**
     * event types in the transition event interface
     *@type {Array}
    */
    static get events() {
        return ['transitionrun', 'transitionstart', 'transitionend', 'transitioncancel'];
    }

    /**
     * event init keys
     *@type {Array}
    */
    static get eventInitKeys() {
        let keys = Driver.eventInitKeys;

        keys.push('propertyName', 'elapsedTime');
        return keys;
    }

    /**
     * initializes the event according to the TransitionEvent interface eventInit requirement
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
     *@type {string}
    */
    get [Symbol.toStringTag]() {
        return 'TransitionDriver';
    }

    /**
     *@param {Object} event - the event object
    */
    constructor(event) {
        super(event);
    }

    /**
     * the css name property associated with the transition. it is always empty string
     *@type {string}
    */
    get propertyName() {
        return this.event.propertyName;
    }

    /**
     * the elapsed time associated with the animation in seconds
     *@type {float}
    */
    get elapsedTime() {
        return this.event.elapsedTime;
    }

    /**
     * a string starting with '::', containing the name of the pseudo-element the
     * animation runs on. If the transition doesn't run on a pseudo-element but on the element,
     * an empty string is returned
     *@type {string}
    */
    get pseudoElement() {
        return this.event.pseudoElement;
    }
}

onInstall(function() {
    TransitionEventPollyfill.install(host, TransitionDriver.initEvent);
});