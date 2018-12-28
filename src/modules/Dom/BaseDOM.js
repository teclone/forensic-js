import Queue from '../Queue';

/**
 * base Dom class
*/
export default class extends Queue {
    /**
     * creates a base dom object
     *@param {Array} result - array of result items
    */
    constructor(result) {
        super(result);
    }

    /**
     * returns the first node item in the result set
     *@type {null|Element|Text|DocumentFragment}
    */
    get node() {
        return this.first();
    }
}