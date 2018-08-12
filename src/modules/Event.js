import { install, uninstall, host, root, onInstall } from './Globals.js';
import Util from './Util.js';
import Queue from './Queue.js';
import Driver from './Event/Drivers/Driver.js';
import UIDriver from './Event/Drivers/UIDriver.js';
import FocusDriver from './Event/Drivers/FocusDriver.js';
import MouseDriver from './Event/Drivers/MouseDriver.js';
import TransitionDriver from './Event/Drivers/TransitionDriver.js';
import AnimationDriver from './Event/Drivers/AnimationDriver.js';
import CustomDriver from './Event/Drivers/CustomDriver.js';

const EVENT_DRIVERS = [
    // Driver interface
    {
        name: 'Driver',
        events: new Queue(Driver.events, true, true),
    },

    //Transition Driver interface
    {
        name: 'TransitionDriver',
        events: new Queue(null, true, true)
    },

    //Animation Driver interface
    {
        name: 'AnimationDriver',
        events: new Queue(null, true, true)
    },

    //UI Driver interface
    {
        name: 'UIDriver',
        events: new Queue(UIDriver.events, true, true)
    },

    //Focus Driver interface
    {
        name: 'FocusDriver',
        events: new Queue(FocusDriver.events, true, true)
    },

    //Mouse Driver interface
    {
        name: 'MouseDriver',
        events: new Queue(MouseDriver.events, true, true)
    }
];

let
    /*
     *event driver classes
    */
    driverClasses = {
        Driver, CustomDriver, UIDriver, FocusDriver, MouseDriver, TransitionDriver,
        AnimationDriver
    },

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
     * constructs an event configuration object
     *@param {Object} config - the event config
     *@param {boolean} deep - boolean value indicating if the construct should be deep, if it should
     * include runOnce, capture and acceptBubbledEvents, bindPassive
     *@returns {Object}
    */
    constructConfig = function(config, deep) {
        config = Util.isPlainObject(config)? config : {};

        let xConfig = {
            runFirst: config.runFirst? 1 : 0,
            runLast: config.runLast? 1 : 0,
            priority: Util.isNumber(config.priority)? config.priority : 5
        };

        if (deep) {
            xConfig.acceptBubbledEvents = typeof config.acceptBubbledEvents !== 'undefined' &&
                !config.acceptBubbledEvents? false : true;
            xConfig.passive = config.passive? true : false;
            xConfig.runOnce = config.runOnce? true : false;
            xConfig.capture = config.capture? true : false;
        }
        return xConfig;
    },

    /**
     * constructs an event driver for the given event
     *@param {Event} event - the event object
     *@return {Object}
    */
    constructDriver = function(event) {
        let type = event.type,
            target = event.target,
            eventDriver = null;

        for (const x of EVENT_DRIVERS) {
            if (x.events.includes(type) && typeof driverClasses[x.name] !== 'undefined') {
                eventDriver = new driverClasses[x.name](event);
                break;
            }
        }

        //if no driver is found, use custom driver
        if (eventDriver === null)
            eventDriver = new CustomDriver(event);

        return {target, eventDriver};
    },

    /**
     * aliases the event type to the real event that is supported by the browser
     *@param {string} type - event type to aliase
     *@returns {string}
    */
    aliaseEventType = function(type) {
        if (typeof eventStates.aliases[type] !== 'undefined')
            return eventStates.aliases[type];
        else
            return type;
    },

    /**
     * checks if the event listener bind process should proceed.
     *@private
     *@param {string} type - the event type
     *@param {Function} callback - the event callback listener
     *@param {EventTarget} target - the event target
     *@param {Object} config - event listener configuration object,
     *@param {boolean} config.passive - boolean value indicating if the listener is a passive listener
     *@param {boolean} config.capture - boolean value indicating if the listener should be bound on the capture phase
     *@param {Object} [scope] - scope execution object
     *@param {Array} [parameters=[]] - array of parameters to pass to listener during execution
     *@returns {boolean}
    */
    proceedToBind = function(type, callback, target, config, scope, parameters) {
        let shouldProceed = false;
        if (typeof type === 'string' && type) {
            shouldProceed = true;
            let boundTypes = config.passive? eventStates.boundPassiveEventTypes : eventStates.boundEventTypes;

            if (boundTypes.includes(type))
                shouldProceed = false;
            else
                boundTypes.push(type);

            //check if we should store the listener
            let listeners = null,
                storelistener = true;

            if (config.capture)
                listeners = config.passive? eventStates.capturePhasePassiveEventListeners : eventStates.capturePhaseEventListeners;
            else
                listeners = config.passive? eventStates.passiveEventListeners : eventStates.eventListeners;

            if (typeof listeners[type] === 'undefined')
                listeners[type]= new Queue([], true, false, fnSort);
            else
                listeners[type].forEach(function(listener) {
                    if (listener.callback === callback && listener.target === target) {
                        storelistener = false;
                        return 'stop';
                    }
                });

            if (storelistener)
                listeners[type].push({callback, target, scope, parameters, config});
        }
        return shouldProceed;
    },

    /**
     * throttles events
     *@param {string} type - the event type to throttle
     *@param {number} timestamp - the event timestamp
     *@return {boolean}
    */
    throttleEvent = function(type, timestamp) {
        let timestampKey = type + 'ThrottleTimestamp',
            intervalKey = type + 'ThrottleInterval';

        let lastTimestamp = eventStates[timestampKey];

        if ((timestamp - lastTimestamp) < eventStates[intervalKey])
            return true;

        eventStates[timestampKey] = timestamp;
        return false;
    },

    /**
     * executes event states listeners route
     *@private
     *@param {Object} e - the event object
     *@param {Object} capturingEventStateListeners - the capturing event state listeners object
     *@param {Object} eventStateListeners - the event state listeners object
     *@param {boolean} [passive=false] - boolean value indicating if event is passive
    */
    executeEventStateListenersRoute = function(e, capturingEventStateListeners, eventStateListeners, passive) {

        let run = function(eventDriver, listener, target, lTarget) {
            //should scope the event target or the current event target?
                let scope = Util.isObject(listener.scope)? listener.scope : target;

                eventDriver.currentTarget = lTarget;

                if (listener.config.runOnce)
                    eventModule.unbind(eventDriver.type, listener.callback, lTarget, listener.config);

                Util.runSafeWithDefaultArg(listener.callback, eventDriver, scope,
                    listener.parameters);
            },

            type = e.type,
            capturingListeners = typeof capturingEventStateListeners[type] !== 'undefined'?
                capturingEventStateListeners[type] : null,
            listeners = typeof eventStateListeners[type] !== 'undefined'?
                eventStateListeners[type] : null;

        if (eventStates.silenceEvents)
            e.stopPropagation(); //stop further browsing of the event.

        //check for
        switch(type) {
            case 'scroll':
            case 'resize':
                if (throttleEvent(type, e.timeStamp))
                    return;
                break;

        }

        if ((capturingListeners && capturingListeners.length > 0) || (listeners && listeners.length > 0)) {
            let {target, eventDriver} = constructDriver(e);
            eventDriver.passive = passive;


            //current event phase is capture phase.
            if (capturingListeners) {
                capturingListeners.clone().forEach(listener => {
                    let proceed = false,
                        lTarget = listener.target;

                    if (lTarget === host || lTarget === root)
                        proceed = true;
                    else if (target !== host && target !== root && Util.nodeContains(lTarget, target))
                        proceed = true;

                    if (proceed)
                        run(eventDriver, listener, target, lTarget);

                    if(!eventDriver.isPropagating)
                        return 'stop';
                });
            }

            //enter the next phase.
            if (listeners && eventDriver.isPropagating) {
                listeners.clone().forEach(listener => {
                    let proceed = false,
                        lTarget = listener.target;

                    if (lTarget === target)
                        proceed = true;
                    else if (eventDriver.bubbles && listener.config.acceptBubbledEvents &&
                    (lTarget === host || lTarget === root || Util.nodeContains(lTarget, target)))
                        proceed = true;

                    if (proceed) {
                        eventDriver.phase = lTarget === target? 2 : 3;
                        run(eventDriver, listener, target, lTarget);
                    }

                    if(!eventDriver.isPropagating)
                        return 'stop';
                });
            }

            eventDriver.phase = 0;
        }
    },

    /**
     * passive event listener router, routes the event to its listeners
     *@param {Object} e - the event object
    */
    passiveEventListenerRouter = function(e) {
        //if event has not been handled, handle it
        if (typeof e.pEventId === 'undefined') {
            e.pEventId = eventStates.eventId;
            executeEventStateListenersRoute(e, eventStates.capturePhasePassiveEventListeners, eventStates.passiveEventListeners, true);
        }
    },

    /**
     * event listener router, routes the event to its listeners
     *@param {Object} e - the event object
    */
    eventListenerRouter = function(e) {
        //if event has not been handled, handle it
        if (typeof e.eventId === 'undefined') {
            e.eventId = eventStates.eventId;
            executeEventStateListenersRoute(e, eventStates.capturePhaseEventListeners, eventStates.eventListeners);
        }
    },

    /**
     * binds event router for the given event type
     *@private
     *@param {string} type - the event type
     *@param {Object} config - the event configuration options
     *@param {boolean} config.passive - boolean value indicating if the listener is a passive listener
    */
    bindListener = function(type, config) {
        let router = config.passive? passiveEventListenerRouter : eventListenerRouter;

        //bind on root document
        root.addEventListener(type, router, eventStates.hasPassiveEventListenerSupport? {
            passive: config.passive,
            capture: true
        }: true);

        //bind on window object
        host.addEventListener(type, router, eventStates.hasPassiveEventListenerSupport? {
            passive: config.passive,
            capture: true
        }: true);
    },

    /**
     * executes all bound ready event listeners once the DOMContentLoaded event is fired
     *@param {Object} e - the event object
    */
    executeReadyEventListeners = function(e) {
        let {eventDriver} = constructDriver(e);

        eventStates.readyEventListeners.forEach((listener) => {
            Util.runSafeWithDefaultArg(listener.callback, eventDriver,
                listener.scope || eventDriver, listener.parameters);
        }).empty();
    },

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

    /**
     * registers ready event listener.
     *
     *@param {Function} callback - the callback function
     *@param {Object} [config] - optional configuration object
     *@param {boolean} [config.runLast=false] - boolean value indicating if this listener
     * should be executed last
     *@param {boolean} [config.runFirst=false] - boolean value indicating if this listener
     * should be executed first
     *@param {number} [config.priority=5] - integer value indicating listener execution
     * priority level. defaults to 5
     *@param {Object} [scope=host] - scope execution object, defaults the event object
     *@param {...*} [parameters] - comma separated list of parameters to pass to listener
     * during execution
     *@throws {TypeError} if listener is not a function.
     *@returns {this}
    */
    ready(callback, config, scope, ...parameters) {
        if (!Util.isCallable(callback))
            throw new TypeError('argument one is not a function');

        config = constructConfig(config, false);
        eventStates.readyEventListeners.push({callback, scope, parameters, config});

        return this;
    },

    /**
     * binds event listener for a specified event type(s) on a given event target.
     *
     *@param {string|string[]} type - event type or array of event types
     *@param {Function} callback - event listener callback
     *@param {EventTarget} target - event target object
     *@param {Object} [config] - optional configuration object
     *@param {boolean} [config.passive=false] - boolean value indicating if listener
     * should be bound in passive or non passive mode. defaults to false
     *@param {boolean} [config.capture=false] - boolean value indicating if listener should be
     * bound to the capturing phase. defaults to false
     *@param {boolean} [config.runLast=false] - boolean value indicating if listener should
     * be executed last. defaults to false
     *@param {boolean} [config.runFirst=false] - boolean value indicating if listener should
     * be executed first. defaults to false
     *@param {boolean} [config.runOnce=false] - boolean value indicating if listener should
     * run only once. defaults to false
     *@param {number} [config.priority=5] - integer value indicating listener execution
     * priority level. defaults to 5
     *@param {boolean} [config.acceptBubbledEvents=true] - set to false if you only want the
     * listener callback to be executed when the event origin is the target given. Bubbled
     * events will not trigger execution if set to false.
     *@param {Object} [scope] - scope execution object. defaults to host object
     *@param {...*} [parameters] - comma separated list of parameters to pass to listener
     * during execution
     *@throws {Error|TypeError} if listener is not a function, or if the dom is not yet loaded
     * and ready
     *@returns {this}
    */
    bind(type, callback, target, config, scope, ...parameters) {
        if (!Util.isCallable(callback))
            throw new TypeError('argument two is not a function');

        if (!Util.isEventTarget(target))
            throw new TypeError('argument three is not a valid event target');

        let xConfig = constructConfig(config, true),
            types = Util.makeArray(type);

        types.forEach(type => {
            type = aliaseEventType(type);
            if (proceedToBind(type, callback, target, xConfig, scope, parameters))
                bindListener(type, xConfig);
        });
        return this;
    },
};

export default eventModule;