/**
 * event initialization options.
 *@typedef {Object} InputEventInit
 *@property {boolean} [InputEventInit.bubbles=true] - boolean value indicating if event bubbles
 *@property {boolean} [InputEventInit.cancelable=false] - boolean value indicating if event is
 * cancelable
 *@property {boolean} [InputEventInit.persisted=false] - boolean property
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
                [Symbol.toStringTag]: {
                    get() {
                        return 'InputEvent';
                    }
                },

                /**
                 *@type {string}
                */
                data: {
                    get() {
                        return eventInit.data;
                    }
                },

                /**
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