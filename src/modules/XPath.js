import { onInstall, host, install, uninstall } from './Globals.js';
import Util from './Util.js';
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
     * resolves namespace specific to ActiveXObject implementation only and returns the
     * resolved namespace or empty string
     *
     *@param {Object} [namespaces] - the namespace object
     *@returns {string}
    */
    /* istanbul ignore next */
    resolveActiveXObjectNamespace = function (namespaces) {
        if (!Util.isPlainObject(namespaces))
            return '';
        else
            return Object.keys(namespaces).map(key => {
                return `xmlns:${key}="${namespaces[key]}"`;
            }).join(' ');
    },

    /**
     * returns a dom implementation namesapace resolver for the given namespace.
     *@param {Object} [namespaces] - the namespace object
     *@returns {Function|null}
    */
    resolveDOMImplementationNamespace = function (namespaces) {
        if (Util.isPlainObject(namespaces))
            return function(prefix) {
                /* istanbul ignore else */
                if (typeof namespaces[prefix] !== 'undefined')
                    return namespaces[prefix];
                else
                    return null;
            };
        else
            return null;
    },

    /**
     * validates the selector and node
     *@param {string} selector - the xPath selector
     *@param {Document|Element} node - the context node
     *@returns {Document}
    */
    validate = function(selector, node) {
        if (typeof selector !== 'string')
            throw new TypeError(selector + ' is not an xPath selector');

        if (!Util.isElementNode(node) && !Util.isDocumentNode(node))
            throw new TypeError(node + ' is not a valid xPath selection context node');

        /* istanbul ignore if */
        if (!xPathStates.supported)
            throw new Error('XPath is not supported');

        return Util.isElementNode(node)? node.ownerDocument : node;
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

    /**
     * selects the first matching node or null if there is no match
     *@param {string} selector - the xPath selector
     *@param {Document|Element} node - the context node
     *@param {Object} [namespaces] - the namespaces object
     *@returns {Node|null}
    */
    selectNode(selector, node, namespaces) {
        let reference = validate(selector, node);
        /* istanbul ignore if */
        if (xPathStates.implementation == 1) {
            reference.setProperty('SelectionNamespaces', resolveActiveXObjectNamespace(namespaces));
            return node.selectSingleNode(selector);
        }
        else {
            let xPathResult = reference.evaluate(
                selector, node, resolveDOMImplementationNamespace(namespaces),
                host.XPathResult.FIRST_ORDERED_NODE_TYPE, null
            );
            return xPathResult.singleNodeValue;
        }
    },
};