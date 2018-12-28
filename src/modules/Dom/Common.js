import Util from '../Util';

/**
 *@private
 * runs query on the dom.
 *@param {string} selector - the query selector string
 *@param {Document|Element|DocumentFragment} context - context to run query
 *@returns Array
*/
export const runQuery = function(selector, context) {

    selector = selector.toString();
    /** optimize query
     * credits to Ryan Morr of Canada
     * http://ryanmorr.com/abstract-away-the-performance-faults-of-queryselectorall/
    */

    // Handle ID-based selectors
    if (/^#[\w-]+$/.test(selector)) {
        let rootNode = Util.isDocumentNode(context) || Util.isDOMFragmentNode(context)?
            context : context.ownerDocument;
        return Util.makeArray(rootNode.getElementById(selector.substring(1)), true);
    }

    // Handle tag-based selectors
    if (/^[\w-]+$/.test(selector))
        return [...context.getElementsByTagName(selector)];

    //handle class based selectors
    let classSelector = '\\.\\w[-\\w]*(?:\\.\\w[-\\w]*)*',
        regex = new RegExp(
            classSelector // match the first class selector
            +
            '(?:\\s*,\\s*' + classSelector + ')*' //macth optional recurring class selectors
        );

    if (regex.test(selector))
        return selector.split(/\s*,\s*/).reduce((result, selector) => {
            return [
                ...result,
                ...context.getElementsByClassName(
                    selector.substring(1).split('.').join(' ')
                )
            ];
        }, []);

    let removeId = false;
    if (selector.indexOf('>') === 0) {
        if(!context.id) {
            context.id = '_' + Util.getRandomText(6);
            removeId = true;
        }
        selector = '#' + context.id + ' ' + selector;
    }

    //add the scope pseudo class https://developer.mozilla.org/en-US/docs/Web/API/Element/querySelectorAll
    selector = ':scope ' + selector;
    let result = null;
    try {
        result = [...context.querySelectorAll(selector)];
    }
    catch(ex) {
        result = [];
    }

    if(removeId)
        context.removeAttribute('id');

    return result;
};