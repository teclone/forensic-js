import Transport from '../../../src/modules/Xhr/Transport.js';
import Request from '../../../src/modules/Xhr/Request.js';
import Response from '../../../src/modules/Xhr/Response.js';

describe('Request', function() {
    let transport = null;

    //start up server in node.js environment before any test begins
    before(function() {
        if (typeof server !== 'undefined') {
            server.listen();
        }
    });

    //close up server in node.js environment after running tests
    after(function() {
        if (typeof server !== 'undefined') {
            server.close();
        }
    });

    beforeEach(function() {
        transport = Transport.create();
    });

    describe('#constructor(request)', function() {
        it('should create a response object given the request object', function() {
            let request = new Request('/', {}, () => {}, () => {}, transport);
            return request.send().then(function (request) {
                expect(new Response(request)).to.be.a('Response');
            });
        });
    });

    describe('#statusCode', function() {
        it('should reflect the response status code as sent by the server as an integer', function() {
            let request = new Request('user/create', {method: 'POST'}, () => {}, () => {}, transport);
            return request.send().then(function (request) {
                let response = new Response(request);
                expect(response.statusCode).to.equals(201);
            });
        });
    });

    describe('#statusMessage', function() {
        it('should reflect the response status message as sent by the server', function() {
            let request = new Request('user/create', {method: 'POST'}, () => {}, () => {}, transport);
            return request.send().then(function (request) {
                let response = new Response(request);
                expect(response.statusMessage).to.equals('User created');
            });
        });
    });

    describe('#getHeader(name)', function() {
        it(`should return the response header value for the given response header name as
        returned by the server`, function() {
            let request = new Request('package.json', {}, () => {}, () => {}, transport);
            return request.send().then(function (request) {
                let response = new Response(request);
                expect(response.getHeader('Content-Type')).to.equals('application/json');
            });
        });

        it(`should return null if no header of the given name was sent by the server`, function() {
            let request = new Request('package.json', {}, () => {}, () => {}, transport);
            return request.send().then(function (request) {
                let response = new Response(request);
                expect(response.getHeader('Content-Typ')).to.equals(null);
            });
        });
    });

    describe('#getHeaders(camelize?)', function() {
        it(`should return all response headers sent by the server as an object with all
        header names turned into camel cases`, function() {
            let request = new Request('package.json', {}, () => {}, () => {}, transport);
            return request.send().then(function (request) {
                let response = new Response(request);

                expect(response.getHeaders()).to.be.an('object')
                    .and.to.have.own.property('contentType')
                    .but.not.own.property('content-type');

                response.getHeaders();
            });
        });

        it(`should return all the headers with the object keys as lowercase but not camelized
        if the camelize option is set as false. Default value is true`, function() {
            let request = new Request('package.json', {}, () => {}, () => {}, transport);
            return request.send().then(function (request) {
                let response = new Response(request);

                expect(response.getHeaders(false)).to.be.an('object')
                    .and.to.have.own.property('content-type')
                    .but.not.own.property('contentType');
            });
        });
    });

    describe('#text()', function() {
        it(`should return the reponse text`, function() {
            let request = new Request('/', {}, () => {}, () => {}, transport);
            return request.send().then(function (request) {
                let response = new Response(request);
                expect(response.text()).to.equals('Hello World');
            });
        });
    });

    describe('#json()', function() {
        it(`should return the parsed json object for all server response with Content-Type
        header of either 'application/json' or 'text/json'`, function() {
            let request = new Request('package.json', {}, () => {}, () => {}, transport);
            return request.send().then(function (request) {
                let response = new Response(request);

                expect(response.getHeaders(false)['content-type']).to.equals('application/json');
                expect(response.json().name).to.equals('forensic-js');
            });
        });

        it(`should return the parsed json object for all requests whose options.responseType
        parameter is set as 'json' even when the server fails to send the correct Content-Type
        header`, function() {
            let request = new Request('send-incorrect-content-type/json', {responseType: 'json'}, () => {}, () => {}, transport);
            return request.send().then(function (request) {
                let response = new Response(request);

                expect(response.json().message).to.equals('I still parsed it');
            });
        });

        it(`should return an empty plain object if json string could not be parsed`, function() {
            let request = new Request('send-invalid-content/json', {}, () => {}, () => {}, transport);
            return request.send().then(function (request) {
                let response = new Response(request);
                expect(response.json()).to.deep.equals({});
            });
        });

        it(`should return null if response content-type header is neither 'application/json' nor
        'text/json' and request's options.responseType parameter is not set as 'json'`, function() {
            let request = new Request('README.md', {}, () => {}, () => {}, transport);
            return request.send().then(function (request) {
                let response = new Response(request);
                expect(response.json()).to.equals(null);
            });
        });
    });

    describe('#arrayBuffer()', function() {
        it(`should return the parsed response as array buffer for all requests whose options.responseType
        parameter is set as 'arraybuffer'`, function() {
            let request = new Request('/', {responseType: 'arraybuffer'}, () => {}, () => {}, transport);
            return request.send().then(function (request) {
                let response = new Response(request);

                expect(response.arrayBuffer()).to.be.an('ArrayBuffer');
            });
        });
    });

    describe('#blob()', function() {
        it(`should return the parsed response as blob for all requests whose options.responseType
        parameter is set as 'blob'`, function() {
            let request = new Request('/', {responseType: 'blob'}, () => {}, () => {}, transport);
            return request.send().then(function (request) {
                let response = new Response(request);

                expect(response.blob()).to.be.a('Blob');
            });
        });
    });

    describe('#document()', function() {
        it(`should return the parsed response as document for all requests whose options.responseType
        parameter is set as 'document'`, function() {
            let request = new Request('/send-content/html', {responseType: 'document'}, () => {}, () => {}, transport);
            return request.send().then(function (request) {
                let response = new Response(request);
                expect(response.document().nodeType).to.equals(9);
            });
        });
    });

    describe('#ok', function() {
        it(`should be true if the request response code is within the 200 range'`, function() {
            let request = new Request('/send-response-code/204', {}, () => {}, () => {}, transport);
            return request.send().then(function (request) {
                let response = new Response(request);
                expect(response.statusCode).to.equals(204);
                expect(response.ok).to.be.true;
            });
        });

        it(`should be true if the request response code is 304'`, function() {
            let request = new Request('/send-response-code/304', {}, () => {}, () => {}, transport);
            return request.send().then(function (request) {
                let response = new Response(request);
                expect(response.statusCode).to.equals(304);
                expect(response.ok).to.be.true;
            });
        });

        it(`should be false for all other response code values'`, function() {
            let request = new Request('/send-response-code/301', {}, () => {}, () => {}, transport);
            return request.send().then(function (request) {
                let response = new Response(request);
                expect(response.statusCode).to.equals(301);
                expect(response.ok).to.be.false;
            });
        });
    });
});