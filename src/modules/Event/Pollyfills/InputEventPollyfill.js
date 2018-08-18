/**
 *@module InputEventPollyfill
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
        if (createDOMEvent('InputEvent', 'beforeinput') !== null) {
            installed = true;
            return;
        }

        /**
         *@constructor
         *@memberof EventPollyfills.InputEventPollyfill#
         *@param {string} type - the event type
         *@param {InputEventInit} eventInit - the event init object
        */
        host.InputEvent = function(type, eventInit) {
            /* istanbul ignore else */
            if (eventInit)
                eventInit = initEvent({}, eventInit);
            else
                eventInit = initEvent({}, {});
            let event = createDOMEvent('Event', type, eventInit, ['bubbles', 'cancelable']);

            Object.defineProperties(event, {
                /**
                 *@memberof EventPollyfills.InputEventPollyfill#
                 *@private
                 *@type {string}
                */
                [Symbol.toStringTag]: {
                    get() {
                        return 'InputEvent';
                    }
                },

                /**
                 * event data
                 *@memberof EventPollyfills.InputEventPollyfill#
                 *@type {string}
                */
                data: {
                    get() {
                        return eventInit.data;
                    }
                },

                /**
                 * boolean indicating if event occured as part of a composition event
                 *@memberof EventPollyfills.InputEventPollyfill#
                 *@type {boolean}
                */
                isComposing: {
                    get() {
                        return eventInit.isComposing;
                    }
                },
            });

            return event;
        };

        installed = true;
    }
};