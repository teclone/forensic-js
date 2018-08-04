/**
 * Utility module
 * this module defines a bunch of utility functions that will be relevant to most other modules
 *@module Util
*/
import {toString, host, root, install, uninstall} from './Globals.js';

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
     * tests if a variable is a number
     *@param {*} variable - variable to test
     *@returns {boolean}
    */
    isNumber(variable) {
        return typeof variable === 'number' && !isNaN(variable) && isFinite(variable);
    },

    /**
     * tests if a variable is a function
     *@param {*} variable - variable to test
     *@returns {boolean}
    */
    isCallable(variable) {
        return (toString.call(variable) === '[object Function]' || variable instanceof Function) && !(variable instanceof RegExp);
    },

    /**
     * tests if a variable is an array
     *@param {*} variable - variable to test
     *@returns {boolean}
    */
    isArray(variable) {
        return toString.call(variable) === '[object Array]' || variable instanceof Array;
    },

    /**
     * tests if a variable is an object
     *@param {*} variable - variable to test
     *@returns {boolean}
    */
    isObject(variable) {
        return typeof variable === 'object' && variable !== null;
    },

    /**
     * tests an objects toStringTag identity name
     *@param {Object} objectArg - object to test
     *@param {String} name - object expected name
    */
    objectIsA(objectArg, name) {
        return this.isObject(objectArg) && toString.call(objectArg) === `[object ${name}]`;
    },

    /**
     * tests if a variable is a plain object literal
     *@param {*} variable - variable to test
     *@returns {boolean}
    */
    isPlainObject(variable) {
        if (this.isObject(variable)) {
            let prototypeOf = Object.getPrototypeOf(variable);
            return prototypeOf === null || prototypeOf === Object.getPrototypeOf({});
        }
        return false;
    },

    /**
     * tests if a variable is a DOCUMENT_NODE
     *@param {*} node - node to test
     *@returns {boolean}
    */
    isDocumentNode(node) {
        return node? node.nodeType === 9 : false;
    },

    /**
     * tests if a variable is an ELEMENT_NODE
     *@param {*} node - node to test
     *@returns {boolean}
    */
    isElementNode(node) {
        return node? node.nodeType === 1 : false;
    },

    /**
     * tests if a variable is an ATTRIBUTE_NODE
     *@param {*} node - node to test
     *@returns {boolean}
    */
    isAttributeNode(node) {
        return node? (node.nodeType === 2 || toString.call(node) === '[object Attr]') : false;
    },

    /**
     * tests if a variable is a TEXT_NODE
     *@param {*} node - node to test
     *@returns {boolean}
    */
    isTextNode(node) {
        return node? node.nodeType === 3 : false;
    },

    /**
     * tests if a variable is a PROCESSING_INSTRUCTION_NODE
     *@param {*} node - node to test
     *@returns {boolean}
    */
    isProcessingInstructionNode(node) {
        return node? node.nodeType === 7 : false;
    },

    /**
     * tests if a variable is a COMMENT_NODE
     *@param {*} node - node to test
     *@returns {boolean}
    */
    isCommentNode(node) {
        return node? node.nodeType === 8 : false;
    },

    /**
     * tests if a variable is a DOCUMENT_TYPE_NODE
     *@param {*} node - node to test
     *@returns {boolean}
    */
    isDocTypeNode(node) {
        return node? node.nodeType === 10 : false;
    },

    /**
     * tests if a variable is a DOM_FRAGMENT_NODE
     *@param {*} node - node to test
     *@returns {boolean}
    */
    isDOMFragmentNode(node) {
        return node? node.nodeType === 11 : false;
    },

    /**
     * checks if argument is a valid event target
     *@param {*} target - variable to test
     *@returns {boolean}
    */
    isEventTarget(target) {
        return target? this.isCallable(target.dispatchEvent) : false;
    },

    /**
     * tests if a variable is a valid function parameter
     *@param {*} variable - variable to test
     *@param {boolean} excludeNulls - boolean value indicating if null values should be
     * taken as an invalid parameter
     *@returns {boolean}
    */
    isValidParameter(variable, excludeNulls) {
        if (excludeNulls && variable === null)
            return false;
        return typeof variable !== 'undefined';
    },

    /**
     * encodes name value pair and returns it
     *@param {string} name - the name part
     *@param {string} [value] - the value part
    */
    encodeComponent: function(name, value) {
        if (typeof name === 'string' && name.trim()) {
            name = name.trim();
            value = value.toString();
            return `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;
        }
        return '';
    },

    /**
     * encodes an object of name:value pairs and returns it
     *@param {Object} entries - object of name:value pairs
     *@returns {string}
    */
    encodeComponents: function(entries) {
        let results = [];
        for(const [name, value] of Object.entries(entries)) {
            let result = this.encodeComponent(name, value);
            if (result)
                results.push(result);
        }
        return results.join('&');
    },

    /**
     * returns the argument if it is already an array, or makes an array using the argument
     *@param {*} arg - the argument
     *@param {boolean} excludeNulls - boolean value indicating if null argument should default
     * to empty array just like undefined argument
     *@returns {Array}
    */
    makeArray: function(arg, excludeNulls) {
        if (this.isArray(arg))
            return arg;
        return this.isValidParameter(arg, excludeNulls)? [arg] : [];
    },

    /**
     * generates a callback function, scoping the execution with optional extra parameters
     *@param {Function} callback - the callback function
     *@param {Scope} [scope] - the execution scope - defaults to the host object
     *@param {Array} [parameters=null] - array of parameters to pass in to callback during execution
     *@throws {TypeError} throws error if callback is not a function
     *@returns {Function}
    */
    generateCallback(callback, scope, parameters) {
        if (!this.isCallable(callback))
            throw new TypeError('argument one is not a function');

        scope = this.isObject(scope) ? scope : host;
        parameters = this.makeArray(parameters);

        return (...args) => {
            let mergedParameters = [...args, ...parameters];
            try {
                return callback.apply(scope, mergedParameters);
            }
            catch (ex) {
                //
            }
        };
    },

    /**
     * runs the executable and supresses all runtime errors
     *@param {Function} executable - function to execute
     *@param {Scope} [scope] - runtime scope object - defaults to the host object
     *@param {Array} [parameters=null] - array of parameters to pass in to executable
     *@param {number} [runAfter=0] - least number of time in milliseconds to wait before
     * starting the execution
     *@throws {TypeError} if argument one is not a function
     *@returns {mixed} this will return a promise if runAfter parameter is given else it will
     * return the execution control
    */
    runSafe(executable, scope, parameters, runAfter) {
        let callback = this.generateCallback(executable, scope, parameters);
        if (runAfter)
            return new Promise(function(resolve) {
                setTimeout(() => {
                    resolve(callback()); // pass in the return value to the resolve method
                }, runAfter);
            });
        else
            return callback();
    },

    /**
     * runs the executable and supresses all runtime errors with a default argument or array of arguments
     *@param {Function} executable - function to execute
     *@param {*} [defaultArg=null] - default argument or array of default arguments to the executable - defaults to null
     *@param {Scope} [scope] - execution object scope - defaults to host object
     *@param {Array} [parameters=null] - extra parameter or array of extra parameters to pass
     * in to executable
     *@param {number} [runAfter=0] - least number of time in milliseconds to wait before
     * starting the execution
     *@throws {TypeError} if argument one is not a function
     *@returns {mixed} this will return a promise if runAfter parameter is given else it will
     * return the execution control
    */
    runSafeWithDefaultArg(executable, defaultArg, scope, parameters, runAfter) {
        if (!this.isValidParameter(defaultArg))
            defaultArg = null;

        defaultArg = this.makeArray(defaultArg);
        parameters = this.makeArray(parameters);

        let allParameters = [...defaultArg, ... parameters];
        return this.runSafe(executable, scope, allParameters, runAfter);
    },

    /**
     *@description - converts the letters into camel like cases
     *@param {string} value - the string word to convert
     *@param {string|RegExp} [delimiter=/[-_]/] - a delimiter string or regex pattern used in
     * finding split segments
     *@returns {string}
    */
    camelCase(value, delimiter = /[-_]/) {
        value = value.toString();
        let tokens = value.split(delimiter).map((token, idx) => {
            return idx === 0? token : token[0].toUpperCase() + token.substring(1);
        });
        return tokens.join('');
    },

    /**
     *@description - loads inline css into the web page
     *@param {string} cssCode - the css code
     *@returns {Element} returns the style element
    */
    loadInlineCSS: function (cssCode) {
        let styleElement = root.createElement('style');
        styleElement.type = 'text/css';
        styleElement.rel = 'stylesheet';

        styleElement.appendChild(root.createTextNode(cssCode));

        let head = root.getElementsByTagName('head')[0];
        head.appendChild(styleElement);
        return styleElement;
    },

    /**
     * checks if the supplied first argument node contains the second argument node as child node
     *@param {Element|Document} containingNode  - first argument node.
     *@param {Element|TEXTNode} containedNode  - second argument node.
     *@param {boolean} [useLegacyMethod] - specifies if node.contains() method be used even when
     * node.compareDocumentPosition is supported and available
     *@returns {boolean}
    */
    nodeContains(containingNode, containedNode, useLegacyMethod) {
        if (!this.isDocumentNode(containingNode) && !this.isElementNode(containingNode))
            return false;

        if (!this.isElementNode(containedNode) && !this.isTextNode(containedNode))
            return false;

        if (useLegacyMethod || typeof containingNode.compareDocumentPosition === 'undefined') {
            return containingNode.contains(containedNode);
        }
        else {
            return !!(containingNode.compareDocumentPosition(containedNode) & 16);
        }
    },

    /**
     * generates a radom text with given length of characters
     *@param {number} [length=4] - char length of the random text to generate
     *@returns {string}
    */
    getRandomText(length) {
        let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
            rands = [], i = -1;

        length = length? length : 4;
        while (++i < length)
            rands.push(chars.charAt(Math.floor(Math.random() * chars.length)));

        return rands.join('');
    },

    /**
     * performs a deep merge of all comma seperated list of objects and returns a new object
     *@param {...Object} objects - comma separated list of objects to merge
     *@returns {Object}
    */
    mergeObjects(...objects) {
        /**
         * runs the process
         *@param {Object} dest - the destination object
         *@param {Object} src - the src object
         *@returns {Object}
        */
        function run(dest, src) {
            let keys = Object.keys(src);
            for (let key of keys) {
                let value = src[key];

                if (typeof dest[key] === 'undefined') {
                    dest[key] = this.isPlainObject(value)? run.call(this, {}, value) : value;
                }
                else if (this.isPlainObject(value)) {
                    dest[key] = this.isPlainObject(dest[key])?
                        run.call(this, dest[key], value) : run.call(this, {}, value);
                }
                else {
                    dest[key] = value;
                }
            }
            return dest;
        }

        let dest = {};
        for (let object of objects) {
            if (!this.isPlainObject(object))
                continue;
            dest = run.call(this, dest, object);
        }
        return dest;
    }
};