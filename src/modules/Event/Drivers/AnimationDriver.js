/**
 *@module AnimationDriver
 *@memberof EventDrivers
*/

/**
 * event initialization options.
 *@typedef {Object} AnimationEventInit
 *@private
 *@property {boolean} [bubbles=true] - boolean value indicating if event bubbles
 *@property {boolean} [cancelable=false] - boolean value indicating if event is cancelable
 *@property {string} [animationName=''] - animation name
 *@property {float} [elapsedTime=0.0] - transition elapsed time
 *@property {string} [pseudoElement=''] - transition pseudo element
*/

import {createDOMEvent, onInstall, host} from '../../Globals.js';
import Util from '../../Util.js';
import Driver from './Driver.js';
import AnimationEventPollyfill from '../Pollyfills/AnimationEventPollyfill.js';

/**
 * animation event driver class
 *@memberof EventDrivers.AnimationDriver#
 *@see {@link https://developer.mozilla.org/en-US/docs/Web/API/AnimationEvent| Mozilla Developers Network}
*/
export default class AnimationDriver extends Driver {
    /**
     * event types in the animation event interface
     *@memberof EventDrivers.AnimationDriver
     *@type {Array}
    */
    static get events() {
        return ['animationstart', 'animationend', 'animationiteration', 'animationcancel'];
    }

    /**
     * event init keys
     *@memberof EventDrivers.AnimationDriver
     *@type {Array}
    */
    static get eventInitKeys() {
        let keys = Driver.eventInitKeys;

        keys.push('animationName', 'elapsedTime');
        return keys;
    }

    /**
     * initializes the event according to the AnimationEvent interface eventInit requirement
     *@memberof EventDrivers.AnimationDriver
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
     *@memberof EventDrivers.AnimationDriver
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
     *@param {Object} event - the event object
    */
    constructor(event) {
        super(event);
    }

    /**
     *@memberof EventDrivers.AnimationDriver#
     *@private
     *@type {string}
    */
    get [Symbol.toStringTag]() {
        return 'AnimationDriver';
    }

    /**
     * the css animation-name property associated with the animation
     *@memberof EventDrivers.AnimationDriver#
     *@type {string}
    */
    get animationName() {
        return this.event.animationName;
    }

    /**
     * the elapsed time associated with the animation in seconds
     *@memberof EventDrivers.AnimationDriver#
     *@type {float}
    */
    get elapsedTime() {
        return this.event.elapsedTime;
    }

    /**
     * a string starting with '::', containing the name of the pseudo-element the
     * animation runs on. If the transition doesn't run on a pseudo-element but on the element,
     * an empty string is returned
     *@memberof EventDrivers.AnimationDriver#
     *@type {string}
    */
    get pseudoElement() {
        return this.event.pseudoElement;
    }
}

/*install pollyfill */
onInstall(function() {
    AnimationEventPollyfill.install(host, AnimationDriver.initEvent);
});