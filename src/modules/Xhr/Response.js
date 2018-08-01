import Util from '../Util.js';

/**
 * parses json content
 *@param {XMLHttpRequest|ActiveXObject} transport - the request transport object
 *@returns {Object}
*/
function parseJSON(transport) {
    if (Util.isPlainObject(transport.response))
        return transport.response;

    let json = null;
    try {
        json = JSON.parse(transport.responseText);
    }
    catch(ex) {
        json = {};
    }
    return json;
}

export default class {
    /**
     * creates a response object
     *@param {Request} request - the request
    */
    constructor(request) {
        this.transport = request.transport;
        this.status = Number.parseInt(request.transport.status);
        this.headers = null;

        let contentType = (this.getHeader('Content-Type') || '').toLowerCase();

        this._json = null;

        if (request.responseType === 'json' || /(text|application)\/json/.test(contentType))
            this._json = parseJSON(request.transport);

    }

    /**
     *@private
     *@memberof Response#
    */
    get [Symbol.toStringTag]() {
        return 'Response';
    }

    /**
     * boolean indicating if request status is within the 200 range
     *@memberof Response#
     *@type {boolean}
    */
    get ok() {
        if (this.status === 304)
            return true;

        else if (this.status >= 200 && this.status < 300)
            return true;

        else
            return false;
    }

    /**
     * response status code
     *@memberof Response#
     *@type {number}
    */
    get statusCode() {
        return this.status;
    }

    /**
     * response status message
     *@memberof Response#
     *@type {string}
    */
    get statusMessage() {
        return this.transport.statusText;
    }
}