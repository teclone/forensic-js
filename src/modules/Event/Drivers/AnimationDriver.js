/**
 *@namespace Event.Drivers
*/

/**
 * event initialization options.
 *@typedef {Object} AnimationEventInit
 *@property {boolean} [AnimationEventInit.bubbles=true] - boolean value indicating if event bubbles
 *@property {boolean} [AnimationEventInit.cancelable=false] - boolean value indicating if event is cancelable
 *@property {string} [AnimationEventInit.animationName=''] - animation name
 *@property {float} [AnimationEventInit.elapsedTime=0.0] - transition elapsed time
 *@property {string} [AnimationEventInit.pseudoElement=''] - transition pseudo element
*/

import {createDOMEvent, onInstall, host} from '../../Globals.js';
import Util from '../../Util.js';
import Driver from './Driver.js';
import AnimationEventPollyfill from '../Pollyfills/AnimationEventPollyfill.js';

/**
 * animation event driver class
 *@memberof EventDrivers
 *@see {@link https://developer.mozilla.org/en-US/docs/Web/API/AnimationEvent| Mozilla Developers Network}
*/
export default class AnimationDriver extends Driver {
    /**
     * event types in the animation event interface
     *@type {Array}
    */
    static get events() {
        return ['animationstart', 'animationend', 'animationiteration', 'animationcancel'];
    }

    /**
     * event init keys
     *@type {Array}
    */
    static get eventInitKeys() {
        let keys = Driver.eventInitKeys;

        keys.push('animationName', 'elapsedTime');
        return keys;
    }

    /**
     * initializes the event according to the AnimationEvent interface eventInit requirement
     *@param {Object} storeIn - object in which to store initializations
     *@param {AnimationEventInit} getFrom - event initialization objects
     *@returns {Object}
    */
    static initEvent(storeIn, getFrom) {
        Driver.initEvent(storeIn, getFrom);

        storeIn.animationName = typeof getFrom.animationName === 'string'? getFrom.animationName : '';
        storeIn.elapsedTime = Util.isNumber(getFrom.elapsedTime)? getFrom.elapsedTime : 0.0;
        storeIn.pseudoElement = typeof getFrom.pseudoElement === 'string'? getFrom.pseudoElement : '';

        return storeIn;
    }

    /**
     * creates an AnimationEvent object that can be dispatched to an event target
     *@param {string} type - the event type
     *@param {AnimationEventInit} eventInit - event initialization object.
     *@returns {AnimationEvent}
    */
    static create(type, eventInit) {
        return createDOMEvent(
            'AnimationEvent', type, this.initEvent({}, eventInit), this.eventInitKeys
        );
    }

    /**
     *@type {string}
    */
    get [Symbol.toStringTag]() {
        return 'AnimationDriver';
    }

    /**
     *@param {Object} event - the event object
    */
    constructor(event) {
        super(event);
    }

    /**
     * the css animation-name property associated with the animation
     *@type {string}
    */
    get animationName() {
        return this.event.animationName;
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
    AnimationEventPollyfill.install(host, AnimationDriver.initEvent);
});