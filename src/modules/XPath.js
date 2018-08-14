import { onInstall, install, uninstall } from './Globals.js';
import XML from './XML.js';

let xPathStates = {
        /**
         * boolean value indicating if xPath is supported
        */
        supported: false,

        /**
         * tells the kind of xPath implementation used
        */
        implementation: 0
    },

    /**
     * initialize the module
    */
    init = function () {
        let xml = new XML();
        /* istanbul ignore if */
        if (typeof xml.document.selectSingleNode !== 'undefined') {
            //internet explorer implementation
            xPathStates.supported = true;
            xPathStates.implementation = 1;
        }

        /* istanbul ignore else */
        if (!xPathStates.supported && typeof xml.document.evaluate !== 'undefined') {
            //domimplementation
            xPathStates.supported = true;
            xPathStates.implementation = 2;
        }
    };

onInstall(init);

export default {
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
     * indicates if xPath is supported
     *@type {boolean}
    */
    get supported() {
        return xPathStates.supported;
    },

    /**
     * indicates the XPath implementation type that is supported
     *@type {number}
    */
    get implementation() {
        return xPathStates.implementation;
    },
};