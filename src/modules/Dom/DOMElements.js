import Util from '../Util';
import BaseDOM from './BaseDOM';

/**
 * dom elements module
*/
export default class DOMElements extends BaseDOM {
    /**
     *@param {Array} result - array of result items
    */
    constructor(result, {props={}, attrs={}, datas={}, styles={}}, ...children) {
        super(result);

        this.setProps(props).setAttrs(attrs).setDatas(datas).setStyles(styles);

        this.insert(...children);
    }

    /**
     * sets the given property value on every element in the result set
     *@param {string} propName - the property name
     *@param {mixed} propValue - the property value
     *@return {this}
    */
    setProp(propName, propValue) {
        this.forEach(node => {
            node[propName] = propValue;
        });
        return this;
    }

    /**
     * sets the given properties on every element in the result set
     *@param {Object} props - object of element properties to set
     *@return {this}
    */
    setProps(props) {

        if (Util.isPlainObject(props)) {
            for(const [propName, propValue] of Object.entries(props))
                this.setProp(propName, propValue);
        }

        return this;
    }

    /**
     * returns the given property value from the first element in the result,
     * it returns undefined if the property is not defined or if the result set is empty
     *@param {string} propName - the property name
     *@return {mixed}
    */
    getProp(propName) {
        const node = this.node;
        return node !== null? node[propName] : undefined;
    }

    /**
     * calls the getProp method on every of the comma separated list of properties and returns
     * an object of each property's value keyed by the property name
     *@param {...string} propNames - comma separated list of property names
     *@return {Object}
    */
    getProps(...propNames) {

        return propNames.reduce((result, propName) => {
            result[propName] = this.getProp(propName);
            return result;
        }, {});

    }

    /**
     * sets the given attribute value on every element in the result set
     *@param {string} attrName - the attribute name to set
     *@param {mixed} attrValue - the attribute value
     *@return {this}
    */
    setAttr(attrName, attrValue) {
        if (attrName === 'className')
            attrName = 'class';

        this.forEach(node => {
            node.setAttribute(attrName, attrValue);
        });

        return this;
    }

    /**
     * sets the given attributes on every element in the result set
     *@param {Object} attrs - object of element attributes to set
     *@return {this}
    */
    setAttrs(attrs) {

        if (Util.isPlainObject(attrs)) {
            for(let [attrName, attrValue] of Object.entries(attrs))
                this.setAttr(attrName, attrValue);
        }

        return this;
    }

    /**
     * returns the attribute's value from the first element in the result set.
     * It returns undefined if the attribute does not exist on the element or when the result
     * set is emtpy
     *
     *@param {string} attrName - the attribute name
     *@return {string|undefined}
    */
    getAttr(attrName) {
        let node = this.node;

        if (node && node.hasAttribute(attrName))
            return node.getAttribute(attrName);

        return undefined;
    }

    /**
     * calls the getAttr method on the comma separated list of attributes, and returns
     * an object containing each attribute's value keyed in by the attribute name
     *
     *@param {...string} attrNames - comma separated list of attribute names
     *@return {Object}
    */
    getAttrs(...attrNames) {

        return attrNames.reduce((result, attrName) => {
            result[attrName] = this.getAttr(attrName);
            return result;
        }, {});

    }

    /**
     * deletes the given attribute from every element in the result set.
     *
     *@param {string} attrName - the attribute name
     *@return {this}
    */
    deleteAttr(attrName) {

        this.forEach(node => {
            node.removeAttribute(attrName); //it does not throw error if attr does not exist
        });

        return this;
    }

    /**
     * deletes the given comma separated list of attributes from every element in the result set.
     *
     *@param {...string} attrNames - comma separated list of attribute names
     *@return {this}
    */
    deleteAttrs(...attrNames) {

        attrNames.forEach(attrName => {
            this.deleteAttr(attrName);
        });

        return this;
    }

    /**
     * sets the given html5 data value on every element in the result set
     *@param {string} dataName - the html5 data name
     *@param {mixed} dataValue - the data value
     *@return {this}
    */
    setData(dataName, dataValue) {

        this.forEach(node => {
            node.setAttribute('data-' + dataName, dataValue);
        });

        return this;
    }

    /**
     * sets all the given html5 data values on every element in the result set
     *@param {Object} datas - object containing html5 data values
     *@return {this}
    */
    setDatas(datas) {

        if (Util.isPlainObject(datas)) {
            for(let [dataName, dataValue] of Object.entries(datas))
                this.setData(dataName, dataValue);
        }

        return this;
    }

    /**
     * returns the html5 data value from the first element in the result set.
     * returns undefined if result set is empty or if data is not defined
     *@param {string} dataName - the html5 data name
     *@return {string|undefined}
    */
    getData(dataName) {
        let node = this.node;
        if (node && node.hasAttribute('data-' + dataName))
            return node.getAttribute('data-' + dataName);

        return undefined;
    }

    /**
     * calls getData method on each dataName and returns object of html5 data values from the
     * first element in the result set.
     *@param {...string} dataNames - the html5 data names
     *@return {Object}
    */
    getDatas(...dataNames) {

        return dataNames.reduce((result, dataName) => {
            result[dataName] = this.getData(dataName);
            return result;
        }, {});

    }

    /**
     * deletes the given html5 custom data from every element in the result set.
     *
     *@param {string} dataName - the data name
     *@return {this}
    */
    deleteData(dataName) {

        this.forEach(node => {
            node.removeAttribute('data-' + dataName); //it does not throw error if attr does not exist
        });

        return this;
    }

    /**
     * deletes the given comma separated list of html5 custom data from every element in the
     * result set.
     *
     *@param {...string} dataNames - comma separated list of data names
     *@return {this}
    */
    deleteDatas(...dataNames) {

        dataNames.forEach(dataName => {
            this.deleteData(dataName);
        });

        return this;
    }
}