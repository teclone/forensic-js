import { onInstall} from './Globals.js';
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