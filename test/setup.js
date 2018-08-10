let JSDOM = require('jsdom').JSDOM;

/**
 * create dom to be used for testing
*/
let dom = new JSDOM('<!doctype html><html><body></body></html>', {
    url: 'http://127.0.0.1:4000',
    pretendToBeVisual: true
});

/**
 * set up test global variables including a test server to be used for http requests
*/
global.expect = require('chai').expect;
global.server = require('../server/app.js');
global.window = dom.window;
global.document = window.document;

/**
 * a workaround to istanbul's branching error on constructors that extends other constructors.
*/
global.getInstance = function(className, ...parameters) {
    let proto = className.__proto__;

    className.__proto__ = null;
    try {
        new className(...parameters);
    }
    catch(ex) {
        //
    }

    Object.setPrototypeOf(className, proto);
    return new className(...parameters);
};