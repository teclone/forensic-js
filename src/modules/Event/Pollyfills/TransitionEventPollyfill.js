/**
 *@module TransitionEventPollyfill
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
        if (createDOMEvent('TransitionEvent', 'transitionstart') !== null) {
            installed = true;
            return;
        }

        /**
         *@constructor
         *@memberof EventPollyfills.TransitionEventPollyfill#
         *@param {string} type - the event type
         *@param {TransitionEventInit} eventInit - the event init object
        */
        host.TransitionEvent = function(type, eventInit) {
            /* istanbul ignore else */
            if (eventInit)
                eventInit = initEvent({}, eventInit);
            else
                eventInit = initEvent({}, {});
            let event = createDOMEvent('Event', type, eventInit, ['bubbles', 'cancelable']);

            Object.defineProperties(event, {
                /**
                 *@memberof EventPollyfills.TransitionEventPollyfill#
                 *@private
                 *@type {string}
                */
                [Symbol.toStringTag]: {
                    get() {
                        return 'TransitionEvent';
                    }
                },

                /**
                 * transition property
                 *@memberof EventPollyfills.TransitionEventPollyfill#
                 *@type {string}
                */
                propertyName: {
                    get() {
                        return eventInit.propertyName;
                    }
                },

                /**
                 * transition pseudo element
                 *@memberof EventPollyfills.TransitionEventPollyfill#
                 *@type {string}
                */
                pseudoElement: {
                    get() {
                        return eventInit.pseudoElement;
                    }
                },

                /**
                 * transition elapsed time in milliseconds
                 *@memberof EventPollyfills.TransitionEventPollyfill#
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