/**
 *@module XPath
*/
import { onInstall, host, install } from './Globals.js';
import Util from './Util.js';
import XML from './XML.js';

/**
 *@name xPathStates
 *@private
*/
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
     *@private
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
     *@private
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
     *@private
     *@param {string} selector - the xPath selector
     *@param {Document|Element} node - the context node
     *@returns {Array}
    */
    validate = function(selector, node, namespaces) {
        if (typeof selector !== 'string')
            throw new TypeError(selector + ' is not an xPath selector');

        if (!Util.isElementNode(node) && !Util.isDocumentNode(node))
            throw new TypeError(node + ' is not a valid xPath selection context node');

        /* istanbul ignore if */
        if (!xPathStates.supported)
            throw new Error('XPath is not supported');

        let reference = Util.isElementNode(node)? node.ownerDocument : node,
            namespaceResolver = null;

        /* istanbul ignore if */
        if (xPathStates.implementation === 1) {
            namespaceResolver = resolveActiveXObjectNamespace(namespaces);
            reference.setProperty('SelectionNamespaces', namespaceResolver);
        }
        else {
            namespaceResolver = resolveDOMImplementationNamespace(namespaces);
        }

        return [namespaceResolver, reference];
    },

    /**
     * selects and returns the first matching node
     *@private
     *@param {string} selector - the xPath selector
     *@param {Document|Element} node - the context node
     *@param {string|Function|null} namespaceResolver - the resolved namespace in the
     * case of IE implementation or namespace resolver for dom implementation
     *@param {Document} reference - the owner document
     *@returns {Node|null}
    */
    selectNode = function(selector, node, namespaceResolver, reference) {
        /* istanbul ignore if */
        if (xPathStates.implementation == 1)
            return node.selectSingleNode(selector);

        return reference.evaluate(
            selector, node, namespaceResolver, host.XPathResult.FIRST_ORDERED_NODE_TYPE, null
        ).singleNodeValue;
    },

    /**
     * selects and returns the first matching node
     *@private
     *@param {string} selector - the xPath selector
     *@param {Document|Element} node - the context node
     *@param {string|Function|null} namespaceResolver - the resolved namespace in the
     * case of IE implementation or namespace resolver for dom implementation
     *@param {Document} reference - the owner document
     *@returns {Node|null}
    */
    selectNodes = function(selector, node, namespaceResolver, reference) {

        /* istanbul ignore if */
        if (xPathStates.implementation == 1)
            return [...node.selectNodes(selector)];

        let xPathResult = reference.evaluate(
            selector, node, namespaceResolver, host.XPathResult.ORDERED_NODE_ITERATOR_TYPE, null
        );

        let result = [],
            current = xPathResult.iterateNext();
        while (current) {
            result.push(current);
            current = xPathResult.iterateNext();
        }

        return result;
    },

    /**
     * initialize the module
     *@private
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
     * selects and returns the first matching node or null if there is no match
     *@param {string} selector - the xPath selector
     *@param {Document|Element} node - the context node
     *@param {Object} [namespaces] - the namespaces object
     *@returns {Node|null}
    */
    selectNode(selector, node, namespaces) {
        return selectNode(selector, node, ...validate(selector, node, namespaces));
    },

    /**
     * returns an array of all matching node items
     *@param {string} selector - the xPath selector
     *@param {Document|Element} node - the context node
     *@param {Object} [namespaces] - the namespaces object
     *@returns {Node[]}
    */
    selectNodes(selector, node, namespaces) {
        return selectNodes(selector, node, ...validate(selector, node, namespaces));
    },

    /**
     * returns the first node that matches one of the alternate xPath selectors
     * separated using double pipe (||), under the given node context or null if no
     * result is found
     *@param {string} selector - the xPath selector
     *@param {Document|Element} node - the context node
     *@param {Object} [namespaces] - the namespaces object
     *@returns {Node|null}
    */
    selectAltNode(selector, node, namespaces) {
        let [namespaceResolver, reference] = validate(selector, node, namespaces);

        for(selector of selector.split(/\s*\|\|\s*/)) {
            let result = selectNode(selector, node, namespaceResolver, reference);
            if (result !== null)
                return result;
        }

        return null;
    },

    /**
     * returns array of node that matches one of the alternate xPath selectors
     * separated using double pipe (||), under the given node context or empty array if no
     * result is found
     *@param {string} selector - the xPath selector
     *@param {Document|Element} node - the context node
     *@param {Object} [namespaces] - the namespaces object
     *@returns {Node[]}
    */
    selectAltNodes(selector, node, namespaces) {
        let [namespaceResolver, reference] = validate(selector, node, namespaces);

        for(selector of selector.split(/\s*\|\|\s*/)) {
            let result = selectNodes(selector, node, namespaceResolver, reference);
            if (result.length > 0)
                return result;
        }

        return [];
    }
};