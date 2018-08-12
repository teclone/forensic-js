/**
 * event initialization options.
 *@typedef {Object} TransitionEventInit
 *@property {boolean} [TransitionEventInit.bubbles=true] - boolean value indicating if event bubbles
 *@property {boolean} [TransitionEventInit.cancelable=false] - boolean value indicating if event is cancelable
 *@property {string} [TransitionEventInit.propertyName=''] - transition property name
 *@property {float} [TransitionEventInit.elapsedTime=0.0] - transition elapsed time
 *@property {string} [TransitionEventInit.pseudoElement=''] - transition pseudo element
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
                [Symbol.toStringTag]: {
                    get() {
                        return 'TransitionEvent';
                    }
                },

                /**
                 *@type {string}
                */
                propertyName: {
                    get() {
                        return eventInit.propertyName;
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