import { install, uninstall, host, root, onInstall } from './Globals.js';
import Util from './Util.js';
import Queue from './Queue.js';

let
    /**
     * sorting function for event listeners
     *@param {Object} listener1 - the first listener object item
     *@param {Object} listener2 - the second listener object item
    */
    fnSort = function(listener1, listener2) {
        //get there configs into c variables and targets into t variables
        let c1 = listener1.config, c2 = listener2.config,
            t1 = listener1.target, t2 = listener2.target;

        let result = Queue.fnSort(c2.runFirst, c1.runFirst) || Queue.fnSort(c1.runLast, c2.runLast) ||
        Queue.fnSort(c1.priority, c2.priority);

        if (result === 0) {
            if (t1 === t2)
                return 0;
            if (t1 === host)
                return 1;
            if (t2 === host)
                return -1;
            if (t1 === root)
                return 1;
            if (t2 === root)
                return -1;
            if (Util.nodeContains(t2, t1))
                return -1;
            if (Util.nodeContains(t1, t2))
                return 1;
        }
        return result;
    },

    /**
     * holds all states for the event module
    */
    eventStates = {
        /**
         * unique id assigned to all event objects to avoid processing them multiple times
        */
        eventId: Util.getRandomText(4),

        /**
         * stores list of events that should be overriden because of browser prefixes
        */
        aliases: {},

        /**
         * boolean value indicating if transition, animation event support has been tested
        */
        eventsSupportTested: false,

        /**
         * boolean value indicating if events propagation should be stopped, stopping the browsing
         * from further processing of the event. This is one the intended design for this module,
         * The side effect of this is that event listener bound through other means rather than using
         * this module may not execute.
         * to avoid such, especially when using vanilla js or other libraries, set this to false.
        */
        silenceEvents: true,

        /**
         * does the host have support for passive event listener configuration
        */
        hasPassiveEventListenerSupport: false,

        /**
         * holds list of event types that have been bound passively
        */
        boundPassiveEventTypes: new Queue(null, true),

        /**
         * holds list of event types that have been bound so far
        */
        boundEventTypes: new Queue(null, true),

        /**
         * event listeners for the dom ready event type
        */
        readyEventListeners: new Queue([], true, false, fnSort),

        /**
         * event listeners bound on the capture phase
        */
        capturePhaseEventListeners: {},

        /**
         * event listeners bound on the target and bubbling phase
        */
        eventListeners: {},

        /**
         * passive event listeners bound on the capture phase
        */
        capturePhasePassiveEventListeners: {},

        /**
         * passive event listeners bound on the target and bubbling phase
        */
        passiveEventListeners: {},

        /**
         * number of milliseconds to throttle scroll events
        */
        scrollThrottleInterval: 100,

        /**
         * last scroll event timestamp
        */
        scrollThrottleTimestamp: 0,

        /**
         * number of milliseconds to throttle resize events
        */
        resizeThrottleInterval: 100,

        /**
         * last resize event timestamp
        */
        resizeThrottleTimestamp: 0
    },

    /**
     * executes all bound ready event listeners once the DOMContentLoaded event is fired
     *@param {Object} e - the event object
    */
    executeReadyEventListeners = function(e) {},

    /**
     * initializes the event module
    */
    init = function() {
        //test for passive event listener support
        let accessor = {},
            listener = function(){};

        Object.defineProperty(accessor, 'passive', {
            get() {
                eventStates.hasPassiveEventListenerSupport = true;
                return true;
            }
        });
        root.addEventListener('passive', listener, accessor);
        root.removeEventListener('passive', listener, accessor);

        //when the DOMContentLoaded event is fired, execute ready event listeners
        root.addEventListener('DOMContentLoaded', executeReadyEventListeners, false);
        init = null;
    };

onInstall(init);

let eventModule = {
    /**
     * calls the Globals install method with the parameters. This is useful when using the
     * Utils module as a standalone distribution or lib.
     *
     *@param {Object} hostParam - the host object, the global this object in a given usage
     * environment
     *@param {Object} rootParam - the root object. an example is the document object
     *@returns {boolean}
    */
    install(hostParam, rootParam) {
        return install(hostParam, rootParam);
    },

    /**
     * calls the Globals uninstall method with the parameters. This is useful when using the
     * Utils module as a standalone distribution or lib.
     *
     *@returns {boolean}
    */
    uninstall() {
        return uninstall();
    },

    /**
     * sets or retrieves the silence event status
     *@type {boolean}
    */
    get silenceEvents() {
        return eventStates.silenceEvents;
    },

    /*
     * sets the silence events status
    */
    set silenceEvents(status) {
        eventStates.silenceEvents = status? true : false;
    },

    /**
     * sets or retrieves scroll event throttle interval in milliseconds
     *@type {number}
    */
    get scrollEventThrottleInterval() {
        return eventStates.scrollThrottleInterval;
    },

    /*
     * sets the scroll event throttle interval in milliseconds
    */
    set scrollEventThrottleInterval(interval) {
        if (Util.isNumber(interval))
            eventStates.scrollThrottleInterval = interval;
    },

    /**
     * sets or retrieves resize event throttle interval in milliseconds
     *@type {number}
    */
    get resizeEventThrottleInterval() {
        return eventStates.resizeThrottleInterval;
    },

    /*
     * sets the resize event throttle interval in milliseconds
    */
    set resizeEventThrottleInterval(interval) {
        if (Util.isNumber(interval))
            eventStates.resizeThrottleInterval = interval;
    },
};

export default eventModule;