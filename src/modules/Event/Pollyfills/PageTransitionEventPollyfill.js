/**
 * event initialization options.
 *@typedef {Object} PageTransitionEventInit
 *@property {boolean} [PageTransitionEventInit.bubbles=true] - boolean value indicating if event bubbles
 *@property {boolean} [PageTransitionEventInit.cancelable=false] - boolean value indicating if event is
 * cancelable
 *@property {boolean} [PageTransitionEventInit.persisted=false] - boolean property
*/
import { createDOMEvent } from '../../Globals.js';
import Util from '../../Util.js';

let installed = false;

export default {
    install(host, initEvent) {
        /* istanbul ignore if */
        if (installed)
            return;

        /* istanbul ignore if */
        if (createDOMEvent('PageTransitionEvent', 'pageshow') !== null) {
            installed = true;
            return;
        }

        /**
         *@param {string} type - the event type
         *@param {PageTransitionEventInit} eventInit - the event init object
        */
        host.PageTransitionEvent = function(type, eventInit) {
            /* istanbul ignore if */
            if (!Util.isPlainObject(eventInit))
                eventInit = {};

            let event = createDOMEvent('Event', type, initEvent({}, eventInit), ['bubbles', 'cancelable']);

            Object.defineProperties(event, {
                [Symbol.toStringTag]: {
                    get() {
                        return 'PageTransitionEvent';
                    }
                },

                /**
                 *@type {boolean}
                */
                persisted: {
                    get() {
                        return eventInit.persisted;
                    }
                },
            });

            return event;
        };

        installed = true;
    }
};