/**
 * the xhr module performs request related tasks, manages request queues, progress watch,
 * request headers and lots more
 *@module Xhr
*/
import Queue from './Queue.js';
import _Response from './Xhr/Response.js';

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
    },

    /**
     *@private
     * checks for request that have completed, initaiting the appropriate callback
    */
    checkActiveRequests = function () {
        xhrStates.activeRequests.forEach(function(request, idx, queue) {
            if (request.state === 'complete') {
                queue.deleteIndex(idx);

                let response = new _Response(request);
                if (response.ok)
                    request.resolve(response);
                else
                    request.reject(response);
            }
        });
    },

    /**
     *@private
     * executes next request
    */
    executeNextRequest = function () {
        let activeRequests = xhrStates.activeRequests,
            pendingRequests = xhrStates.pendingRequests;

        while(activeRequests.length < 4 && pendingRequests.length > 0) {
            let request = pendingRequests.shift();

            request.send();

            request.stayed = 0;
            activeRequests.put(request);
        }
    },

    /**
     *@private
     * promotes the priority of each pending request that have lasted for ageLimit
    */
    promote = function () {
        var pendingRequests = xhrStates.pendingRequests;
        pendingRequests.forEach((request) => {
            request.age += xhrStates.pollAfter;
            if (request.age >= xhrStates.promoteAfter) {
                request.age = 0;
                request.priority -= 1;
            }
        });
        pendingRequests.sort();
    },

    /**
     *@private
     * manages the polling process.
    */
    manage = function() {
        clearTimeout(xhrStates.iterationId);

        promote();
        executeNextRequest();
        checkActiveRequests();

        if (xhrStates.pendingRequests.length > 0 || xhrStates.activeRequests.length > 0)
            xhrStates.iterationId = setTimeout(manage, xhrStates.pollAfter);
        else
            xhrStates.started = false;
    },

    /**
     *@private
     * starts the polling processing.
    */
    start = function() {
        if (xhrStates.started)
            return;

        xhrStates.iterationId = setTimeout(manage, xhrStates.pollAfter);
        xhrStates.started = true;
    };