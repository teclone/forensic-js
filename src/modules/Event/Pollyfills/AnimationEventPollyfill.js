/**
 *@namespace EventPollyfills
*/

/**
 *@module AnimationEventPollyfill
 *@memberof EventPollyfills
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
         *@constructor
         *@memberof EventPollyfills.AnimationEventPollyfill#
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
                /**
                 *@memberof EventPollyfills.AnimationEventPollyfill#
                 *@private
                 *@type {string}
                */
                [Symbol.toStringTag]: {
                    get() {
                        return 'AnimationEvent';
                    }
                },

                /**
                 * animation name
                 *@memberof EventPollyfills.AnimationEventPollyfill#
                 *@type {string}
                */
                animationName: {
                    get() {
                        return eventInit.animationName;
                    }
                },

                /**
                 * animation pseudo element
                 *@memberof EventPollyfills.AnimationEventPollyfill#
                 *@type {string}
                */
                pseudoElement: {
                    get() {
                        return eventInit.pseudoElement;
                    }
                },

                /**
                 * animation elapsed time in milliseconds
                 *@memberof EventPollyfills.AnimationEventPollyfill#
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