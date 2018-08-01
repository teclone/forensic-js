import Util from '../Util.js';
import { host } from '../Globals.js';

/**
 * processes progress event
 *@param {Event} e - the progress event object
*/
function processProgressEvent(e) {
    /* istanbul ignore else */
    if (e.lengthComputable)
        Util.runSafeWithDefaultArg(this.progress, [e.loaded, e.total]);
}

/**
 * processes timeout events
*/
function onTimeout() {
    this.timedOut = true;
    this._resolve(this);
}

/**
 * processes load events
*/
function onAbort() {
    this.aborted = true;
    this._resolve(this);
}

/**
 * processes load events
*/
function onLoad() {
    this._resolve(this);
}

/**
 * sets request headers
*/
function setRequestHeaders() {
    for (let [name, value] of Object.entries(this.headers))
        this.transport.setRequestHeader(name, value.toString());

    return this;
}

/**
 * sends the request
*/
function send() {

    let url = this.url,
        data  = null,
        queries = '';

    //resolve data and query
    if (this.method === 'POST' || this.method === 'PUT') {
        switch(this.contentType) {
            case 'application/json':
            case 'text/json':
            case 'json':
                this.contentType = 'application/json';
                data = JSON.stringify(this.data);
                break;

            case 'application/x-www-form-urlencoded':
                data = Util.encodeComponents(this.data);
                break;

            default:
                data = this.data;
        }
        if (this.contentType)
            this.headers['Content-Type'] = this.contentType;
    }
    else {
        queries = Util.encodeComponents(this.data);
        if (queries)
            url = url + (url.indexOf('?') > -1? '&' : '?') + queries;
    }

    //resolve cache control
    switch(this.cache.toLowerCase()) {
        case 'no-store':
            this.headers['Cache-Control'] = 'no-store';
            break;
        case 'no-cache':
        case 'reload':
            this.headers['Cache-Control'] = 'no-cache';
            this.headers.Pragma = 'no-cache';
            break;
        case 'force-cache':
            this.headers['Cache-Control'] = 'max-stale';
            break;
        case 'only-if-cached':
            this.headers['Cache-Control'] = 'only-if-cached';
            break;
    }

    if (this.progress)
        this.transport.onprogress = Util.generateCallback(processProgressEvent, this);

    this.transport.open(this.method, url, true);
    this.transport.responseType = this.responseType;

    this.transport.onload = Util.generateCallback(onLoad, this);
    this.transport.onabort = Util.generateCallback(onAbort, this);
    if (this.timeout) {
        this.transport.timeout = this.timeout;
        this.transport.ontimeout = Util.generateCallback(onTimeout, this);
    }

    setRequestHeaders.call(this);

    this.timedOut = false;
    this.aborted = false;

    this.transport.send(data);
}

export default class {

    /**
     * creates a request object
     *@param {string} url - the resource url
     *@param {Object} [options] - optional request configuration object
    */
    constructor(url, options, resolve, reject, transport) {
        this.method = typeof options.method === 'string'? options.method.toUpperCase() : 'GET';

        if (typeof options.overrideMethod === 'string')
            this.method = options.overrideMethod.toUpperCase();

        this.url = url.toString();

        this.cache = typeof options.cache === 'string'? options.cache : 'default';
        this.headers = Util.mergeObjects(options.globalHeaders, options.headers);
        this.data = Util.isObject(options.data)? options.data : {};

        this.priority = Util.isNumber(options.priority)? options.priority : 5;
        this.progress = Util.isCallable(options.progress)? options.progress : null;

        this.resolve = resolve;
        this.reject = reject;

        //resolve request content type
        this.responseType = typeof options.responseType === 'string'? options.responseType : '';
        this.contentType = '';

        if (this.method === 'POST' || this.method === 'PUT') {
            if (typeof options.contentType === 'string')
                this.contentType = options.contentType;
            else if (!(this.data instanceof host.FormData))
                this.contentType = 'application/x-www-form-urlencoded';
        }

        //resolve request timeout
        this.timeout = null;

        if (Util.isNumber(options.timeout))
            this.timeout = options.timeout;

        else if (this.method !== 'POST' && this.method !== 'PUT' && options.timeout !== null && options.timeoutAfter)
            this.timeout = options.timeoutAfter;

        this.transport = transport;
    }

    /**
     * return object identity
    */
    get [Symbol.toStringTag]() {
        return 'Request';
    }

    /**
     * sends the request
     *@returns {Promise}
    */
    send() {
        return new Promise((resolve) => {
            this._resolve = resolve;
            send.call(this);
        });
    }

    /**
     * aborts the request
    */
    abort() {
        this.transport.abort();
    }

    /**
     * returns the request state
     *@type {string}
    */
    get state() {
        if (this.timedOut || this.aborted)
            return 'complete';

        let readyState = this.transport.readyState.toString();
        switch(readyState) {
            case '4':
            case 'complete':
                return 'complete';
            default:
                return readyState;
        }
    }
}