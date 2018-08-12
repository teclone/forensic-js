/**
 * event initialization options.
 *@typedef {Object} AnimationEventInit
 *@property {boolean} [AnimationEventInit.bubbles=true] - boolean value indicating if event bubbles
 *@property {boolean} [AnimationEventInit.cancelable=false] - boolean value indicating if event is cancelable
 *@property {string} [AnimationEventInit.animationName=''] - animation name
 *@property {float} [AnimationEventInit.elapsedTime=0.0] - animation elapsed time
 *@property {string} [AnimationEventInit.pseudoElement=''] - animation pseudo element
*/
import { createDOMEvent } from '../../Globals.js';

let installed = false;

export default {
    install(host, initEvent) {
        /* istanbul ignore if */
        if (installed)
            return;

        /* istanbul ignore if */
        if (createDOMEvent('AnimationEvent', 'animationstart') !== null) {
            installed = true;
            return;
        }

        /**
         *@param {string} type - the event type
         *@param {AnimationEventInit} eventInit - the event init object
        */
        host.AnimationEvent = function(type, eventInit) {
            /* istanbul ignore else */
            if (eventInit)
                eventInit = initEvent({}, eventInit);
            else
                eventInit = initEvent({}, {});
            let event = createDOMEvent('Event', type, eventInit, ['bubbles', 'cancelable']);

            Object.defineProperties(event, {
                [Symbol.toStringTag]: {
                    get() {
                        return 'AnimationEvent';
                    }
                },

                /**
                 *@type {string}
                */
                animationName: {
                    get() {
                        return eventInit.animationName;
                    }
                },

                /**
                 *@type {string}
                */
                pseudoElement: {
                    get() {
                        return eventInit.pseudoElement;
                    }
                },

                /**
                 *@type {number}
                */
                elapsedTime: {
                    get() {
                        return eventInit.elapsedTime;
                    }
                }
            });

            return event;
        };

        installed = true;
    }
};