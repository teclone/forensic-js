/**
 *@module PageTransitionEventPollyfill
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
        if (createDOMEvent('PageTransitionEvent', 'pageshow') !== null) {
            installed = true;
            return;
        }

        /**
         *@constructor
         *@memberof EventPollyfills.PageTransitionEventPollyfill#
         *@param {string} type - the event type
         *@param {PageTransitionEventInit} eventInit - the event init object
        */
        host.PageTransitionEvent = function(type, eventInit) {
            /* istanbul ignore else */
            if (eventInit)
                eventInit = initEvent({}, eventInit);
            else
                eventInit = initEvent({}, {});
            let event = createDOMEvent('Event', type, eventInit, ['bubbles', 'cancelable']);

            Object.defineProperties(event, {
                /**
                 *@memberof EventPollyfills.PageTransitionEventPollyfill#
                 *@private
                 *@type {string}
                */
                [Symbol.toStringTag]: {
                    get() {
                        return 'PageTransitionEvent';
                    }
                },

                /**
                 *@memberof EventPollyfills.PageTransitionEventPollyfill#
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