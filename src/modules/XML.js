/**
 * module internal state
*/
let xmlStates = {

    /**
     * boolean value indicating if module is supported
    */
    supported: false,

    /**
     * internet explorer ActiveXObject implementation version string
    */
    ieString: '',

    /**
     * xml serializer
    */
    serializer: null,

    /**
     * dom xml parser
    */
    parser: null,
};