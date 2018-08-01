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
}