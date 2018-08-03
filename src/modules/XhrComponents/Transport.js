/**
 *@namespace XhrComponents
*/
import {host, onInstall} from '../Globals.js';

let ieString = '',

    supported = false,

    /**
     *@private
     * creates transport through internet explorer active x object construct
    */
    /* istanbul ignore next */
    createActiveXObject = function() {
        return new host.ActiveXObject(ieString);
    },

    /**
     *@private
     * creates transport through the xml http request construct
    */
    creatXMLHttpRequest = function() {
        return new host.XMLHttpRequest();
    },

    /**
     *@private
     * creates a http request transport object. lazy loads
     *@returns {XMLHttpRequest}
    */
    createTransport = function() {
        /* istanbul ignore else */
        if (typeof host.XMLHttpRequest !== 'undefined') {
            supported = true;
            createTransport = creatXMLHttpRequest;
        }

        else if (typeof host.ActiveXObject !== 'undefined') {
            for (const version of ['MSXML2.XMLHttp.6.0', 'MSXML2.XMLHttp.3.0']) {
                try {
                    new host.ActiveXObject(version);
                    supported = true;
                    ieString = version;
                    createTransport = createActiveXObject;
                    return;
                }
                catch(ex) {
                    //
                }
            }
        }

        else {
            createTransport = () => {
                throw new Error('XMLHttpRequest is not supported');
            };
        }
        createActiveXObject = creatXMLHttpRequest = null;
        return createTransport();
    };

onInstall(createTransport);

/**
 *@memberof XhrComponents
*/
export default {

    /**
     * boolean value indicating if xhr transport can be created
     *@type {boolean}
    */
    get supported() {
        return supported;
    },

    /**
     * string value that contains the MSXML version string used in creating
     * the activeXObject, assuming transport was created using this medium
     *
     *@type {boolean}
    */
    get ieString() {
        return ieString;
    },

    /**
     * creates and returns an xml http request
     *
     *@returns {XMLHttpRequest|ActiveXObject}
     *@throws {Error} throws error if not supported
    */
    create() {
        return createTransport();
    }
};