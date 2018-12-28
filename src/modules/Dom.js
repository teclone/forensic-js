import { runQuery } from './Dom/Common';
import DOMElements from './Dom/DOMElements';
import { root } from './Globals';
import Util from './Util';

/**
 * selects elements from the dom that matches the given selector within the given context node
 *@param {string} selector - the query selector string
 *@param {Document|Element|DocumentFragment} [context=Document] - context to run query
 *@returns DOMElements
*/
export const query = function(selector, context) {

    if (!Util.isElementNode(context) && !Util.isDocumentNode(context) && !Util.isDOMFragmentNode(context))
        context = root;

    return new DOMElements(
        runQuery(selector, context)
    );
};

/**
 * creates a dom element and returns the associated DOMElements instance
 *
 *@param {string} element - the element to create
 *@param {Object} [collection={}] - an object collection with optional props object,
 * attr objects and css objects.
 *@param {Object} [collection.props={}] - a collection of element properties to set
 *@param {Object} [collection.attributes={}] - a collection of element attributes to set
 *@param {Object} [collection.datas={}] - a collection of html5 datas to set
 *@param {Object} [collection.styles={}] - a collection of css style rules to set
 *@param {...(string|Text|Element|DocumentFragment|DOMText|DOMElements|DOMFragment)} [children] -
 * comma separated list of child nodes.
 *@return {DOMElements}
*/
export const createElement = function(element, collection, ...children) {
    if (!Util.isPlainObject(collection))
        collection = {};

    let node = root.createElement(element);
    return new DOMElements([node], collection, ...children);
};