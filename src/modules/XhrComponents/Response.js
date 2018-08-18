/**
 *@namespace XhrComponents
*/

/**
 *@module Response
 *@memberof XhrComponents
*/
import Util from '../Util.js';

/**
 * parses json content
 *@private
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
     *@memberof XhrComponents.Response#
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
     *@memberof XhrComponents.Response#
    */
    get [Symbol.toStringTag]() {
        return 'Response';
    }

    /**
     * boolean indicating if request status is within the 200 range
     *@memberof XhrComponents.Response#
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
     *@memberof XhrComponents.Response#
     *@type {number}
    */
    get statusCode() {
        return this.status;
    }

    /**
     * response status message
     *@memberof XhrComponents.Response#
     *@type {string}
    */
    get statusMessage() {
        return this.transport.statusText;
    }

    /**
     * returns http response header by the entry name
     *@memberof XhrComponents.Response#
     *@returns {string} returns string or null if such header was not sent
    */
    getHeader(name) {
        name = name.toString();
        return this.transport.getResponseHeader(name);
    }

    /**
     * returns all response headers as an object
     *@memberof XhrComponents.Response#
     *@param {boolean} [camelize=true] - boolean value indicating if the header keys should be
     * turned into camel case to make it easy to the dot (.) operator. like headers.headerName
     *@returns {Object}
    */
    getHeaders(camelize) {
        if (this.headers === null) {
            this.headers = {};
            let headers = this.transport.getAllResponseHeaders().replace(/\n\r?$/, '').split(/\n\r?/);
            for (let header of headers) {
                let [name, value] = header.split(':');
                this.headers[name.toLowerCase()] = value.trim();
            }
        }
        camelize = typeof camelize !== 'undefined' && !camelize? false : true;
        return !camelize? Object.assign({}, this.headers)  : Object.keys(this.headers).reduce((accumulator, key) => {
            accumulator[Util.camelCase(key)] = this.headers[key];
            return accumulator;
        }, {});
    }

    /**
     * returns response as json object.
     *@memberof XhrComponents.Response#
     *@returns {JSON}
    */
    json() {
        return this._json;
    }

    /**
     * returns response as blob
     *@memberof XhrComponents.Response#
     *@returns {Blob}
    */
    blob() {
        return this.transport.response;
    }

    /**
     * returns response as array buffer
     *@memberof XhrComponents.Response#
     *@returns {ArrayBuffer}
    */
    arrayBuffer() {
        return this.transport.response;
    }

    /**
     * returns response parsed xml or html document
     *@memberof XhrComponents.Response#
     *@returns {Document}
    */
    document() {
        return this.transport.response;
    }

    /**
     * returns response text
     *@memberof XhrComponents.Response#
     *@returns {string}
    */
    text() {
        return this.transport.responseText;
    }
}