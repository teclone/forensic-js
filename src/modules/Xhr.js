/**
 * the xhr module performs request related tasks, manages request queues, progress watch,
 * request headers and lots more
 *@module Xhr
*/
import Queue from './Queue.js';

/**
 *@name xhrStates
 *@private
*/
let xhrStates = {

    /**
     * default request timeout value.
    */
    timeoutAfter: 15000,

    /**
     * boolean value to indicate if manager has been started
    */
    started: false,

    /**
     * time in milliseconds to poll requests in a repeating circle
    */
    pollAfter: 250,

    /**
     * this is the number of milliseconds a request will stay and its priority level will be
     * promoted
    */
    promoteAfter: 3000,

    /**
     * pending requests
    */
    pendingRequests: new Queue(null, true, false, (one, two) => {
        return Queue.fnSort(one.priority, two.priority);
    }),

    /**
     * active requests
    */
    activeRequests: new Queue(null, false),

    /**
     * global headers
    */
    globalHeaders: {

    }
};