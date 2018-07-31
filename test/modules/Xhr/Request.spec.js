import Request from '../../../src/modules/Xhr/Request.js';
import Transport from '../../../src/modules/Xhr/Transport.js';

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

    describe('#constructor(url, options, resolve, reject, transport)', function() {
        it(`should create a Request object if given a request url, options object, resolve and
        reject promises methods, and a transport object`, function() {
            let request = new Request('/', {}, () => {}, () => {}, transport);
            expect(request).to.be.a('Request');
        });

        it(`should create a request object with a default options if options argument is not a
        plain object`, function() {
            let request = new Request('/', null, () => {}, () => {}, transport);
            expect(request.method).to.equals('GET');
        });

        it(`should set the request method to the given options.method parameter. default value
        is GET`, function() {
            let request = new Request('/', {}, () => {}, () => {}, transport);
            expect(request.method).to.equals('GET');

            request = new Request('/', {method: 'post'}, () => {}, () => {}, transport);
            expect(request.method).to.equals('POST');
        });

        it(`should override the request method with the options.overrideMethod parameter if given`, function() {
            let request = new Request('/', {method: 'GET', overrideMethod: 'POST'}, () => {}, () => {}, transport);
            expect(request.method).to.equals('POST');
        });

        it(`should set the request cache to the given options.cache parameter. default value
        is default`, function() {
            let request = new Request('/', {}, () => {}, () => {}, transport);
            expect(request.cache).to.equals('default');

            request = new Request('/', {cache: 'no-store'}, () => {}, () => {}, transport);
            expect(request.cache).to.equals('no-store');
        });

        it(`should set the request data to the given options.data parameter. default value
        is empty plain object {}`, function() {
            let request = new Request('/', {}, () => {}, () => {}, transport);
            expect(request.data).to.deep.equals({});

            request = new Request('/', {data: {name: 'something'}}, () => {}, () => {}, transport);
            expect(request.data).to.deep.equals({name: 'something'});
        });

        it(`should set the request priority to the given options.priority parameter. default value
        is 5`, function() {
            let request = new Request('/', {}, () => {}, () => {}, transport);
            expect(request.priority).to.equals(5);

            request = new Request('/', {priority: 3}, () => {}, () => {}, transport);
            expect(request.priority).to.equals(3);
        });

        it(`should set the request progress callback to the given options.progress parameter. default value
        is null`, function() {
            let request = new Request('/', {}, () => {}, () => {}, transport);
            expect(request.progress).to.equals(null);

            let progress = () => {};
            request = new Request('/', {progress: progress}, () => {}, () => {}, transport);
            expect(request.progress).to.equals(progress);
        });

        it(`should set the request contentType to the given options.contentType parameter when
        the request method is post or put. default value for post or put requests is
        'application/x-www-form-urlencoded'`, function() {
            let request = new Request('/', {method: 'post'}, () => {}, () => {}, transport);
            expect(request.contentType).to.equals('application/x-www-form-urlencoded');

            request = new Request('/', {method: 'put', contentType: 'application/json'}, () => {}, () => {}, transport);
            expect(request.contentType).to.equals('application/json');
        });

        it(`should set the request contentType to 'application/x-www-form-urlencoded' if
        request method is either post or put`, function() {
            let request = new Request('/', {method: 'POST'}, () => {}, () => {}, transport);
            expect(request.contentType).to.equals('application/x-www-form-urlencoded');

            request = new Request('/', {method: 'PUT'}, () => {}, () => {}, transport);
            expect(request.contentType).to.equals('application/x-www-form-urlencoded');
        });

        it(`should set the request timeout to the given options.timeout parameter. default value
        is null`, function() {
            let request = new Request('/', {}, () => {}, () => {}, transport);
            expect(request.timeout).to.equals(null);

            request = new Request('/', {timeout: 5000}, () => {}, () => {}, transport);
            expect(request.timeout).to.equals(5000);
        });

        it(`should set the request timeout to the given default options.timeoutAfter parameter
        if request method is neither post nor put and user did not specify timeout`, function() {
            let request = new Request('/', {timeoutAfter: 15000}, () => {}, () => {}, transport);
            expect(request.timeout).to.equals(15000);
        });

        it(`should set the request timeout to null if options.timeout is null`, function() {
            let request = new Request('/', {timeoutAfter: 15000, timeout: null}, () => {}, () => {}, transport);
            expect(request.timeout).to.equals(null);
        });

        it(`should set the request responseType property to the given options.responseType
        parameter`, function() {
            let request = new Request('/', {responseType: 'json'}, () => {}, () => {}, transport);
            expect(request.responseType).to.equals('json');
        });
    });

    describe('#send()', function() {

        it(`should send the request when called`, function(done) {
            transport.onload = () => {
                if (transport.responseText === 'Hello World')
                    done();
                else
                    done(new Error('request was not sent'));
            };
            let request = new Request('/', {}, () => {}, () => {}, transport);
            request.send();
        });

        it(`should send the request, terminating the request if response time exceeds timeout
        value`, function(done) {
            let request = new Request('/prolong-response', {timeout: 1000}, () => {}, () => {}, transport);
            request.send();
            setTimeout(function() {
                if (request.timedOut && request.state === 'complete')
                    done();
                else
                    done(new Error('Failed to timeout request'));
            }, 1200);
        });

        it(`should send the request, watching for progress event if an options.progress callback
        method is specified`, function(done) {
            let callCount = 0;
            let request = new Request('/', {progress: () => {
                if (callCount === 0) {
                    callCount += 1;
                    done();
                }
            }}, () => {}, () => {}, transport);
            request.send();
        });

        it(`should ignore the contentType options and send the request when called,
        sending data content as query parameters if method is neither post nor put`, function(done) {
            transport.onload = () => {
                if (transport.responseText === '{"name":"Harrison","age":"22"}')
                    done();
                else
                    done(new Error(transport.responseText + ' does not match sent query'));
            };
            let request = new Request('/report-query', {
                method: 'GET',
                data: {
                    name: 'Harrison',
                    age: 22
                }
            }, () => {}, () => {}, transport);
            request.send();
        });

        it(`should append the data to the existing query in the url if there is already an
        existing query in the url`, function(done) {
            transport.onload = () => {
                if (transport.responseText === '{"name":"Harrison","age":"22"}')
                    done();
                else
                    done(new Error(transport.responseText + ' does not match sent query'));
            };
            let request = new Request('/report-query?name=Harrison', {
                method: 'GET',
                data: {
                    age: 22
                }
            }, () => {}, () => {}, transport);
            request.send();
        });

        it(`should send the request when called, sending form-urlencoded content to the server if the
        request method is post or put and request data is not a form-data and contentType header
        is not set or is set as 'application/x-www-form-urlencoded'`, function(done) {
            transport.onload = () => {
                if (transport.responseText === 'application/x-www-form-urlencoded')
                    done();
                else
                    done(new Error('request content-type header sent to server is invalid'));
            };
            let request = new Request('/report-header/content-type', {
                method: 'post',
                data: {
                    name: 'Harrison',
                    age: 22
                }
            }, () => {}, () => {}, transport);
            request.send();
        });

        it(`should send the request when called, sending json content to the server if the
        request method is post or put and contentType header is set as 'json'`, function(done) {
            transport.onload = () => {
                if (transport.responseText === 'application/json')
                    done();
                else
                    done(new Error('request content-type header sent to server is invalid'));
            };
            let request = new Request('/report-header/content-type', {
                method: 'post',
                contentType: 'json',
                data: {
                    name: 'Harrison',
                    age: 22
                }
            }, () => {}, () => {}, transport);
            request.send();
        });

        it(`should send the request when called, sending json content to the server if the
        request method is post or put and contentType header is set as 'application/json'`, function(done) {
            transport.onload = () => {
                if (transport.responseText === 'application/json')
                    done();
                else
                    done(new Error('request content-type header sent to server is invalid'));
            };
            let request = new Request('/report-header/content-type', {
                method: 'post',
                contentType: 'application/json',
                data: {
                    name: 'Harrison',
                    age: 22
                }
            }, () => {}, () => {}, transport);
            request.send();
        });

        it(`should send the request when called, sending json content to the server if the
        request method is post or put and contentType header is set as 'text/json'`, function(done) {
            transport.onload = () => {
                if (transport.responseText === 'application/json')
                    done();
                else
                    done(new Error('request content-type header sent to server is invalid'));
            };
            let request = new Request('/report-header/content-type', {
                method: 'post',
                contentType: 'text/json',
                data: {
                    name: 'Harrison',
                    age: 22
                }
            }, () => {}, () => {}, transport);
            request.send();
        });

        it(`should send the request when called, sending multipart/form-data with boundary token
         to the server if request method is post or put and request data is a form data`, function(done) {
            transport.onload = () => {
                if (transport.responseText.indexOf('multipart/form-data') > -1)
                    done();
                else
                    done(new Error(transport.responseText + ' content-type header sent to server is invalid'));
            };
            let formData = new window.FormData();
            formData.append('name', 'Harrison');

            let request = new Request('/report-header/content-type', {
                method: 'post',
                data: formData
            }, () => {}, () => {}, transport);
            request.send();
        });

        it(`should send the request when called, sending the appropriate cache-control header
        for the given 'no-store' options.cache value`, function(done) {
            transport.onload = () => {
                if (transport.responseText === 'no-store')
                    done();
                else
                    done(new Error('request cache-control header sent to server is invalid'));
            };
            let request = new Request('/report-header/cache-control', {
                cache: 'no-store'
            }, () => {}, () => {}, transport);
            request.send();
        });

        it(`should send the request when called, sending the appropriate cache-control header
        for the given 'reload' options.cache value`, function(done) {
            transport.onload = () => {
                if (transport.responseText === 'no-cache')
                    done();
                else
                    done(new Error('request cache-control header sent to server is invalid'));
            };
            let request = new Request('/report-header/cache-control', {
                cache: 'reload'
            }, () => {}, () => {}, transport);
            request.send();
        });

        it(`should send the request when called, sending the appropriate cache-control header
        for the given 'no-cache' options.cache value`, function(done) {
            transport.onload = () => {
                if (transport.responseText === 'no-cache')
                    done();
                else
                    done(new Error('request cache-control header sent to server is invalid'));
            };
            let request = new Request('/report-header/cache-control', {
                cache: 'no-cache'
            }, () => {}, () => {}, transport);
            request.send();
        });

        it(`should send the request when called, sending the appropriate cache-control header
        for the given 'force-cache' options.cache value`, function(done) {
            transport.onload = () => {
                if (transport.responseText === 'max-stale')
                    done();
                else
                    done(new Error('request cache-control header sent to server is invalid'));
            };
            let request = new Request('/report-header/cache-control', {
                cache: 'force-cache'
            }, () => {}, () => {}, transport);
            request.send();
        });

        it(`should send the request when called, sending the appropriate cache-control header
        for the given 'only-if-cached' options.cache value`, function(done) {
            transport.onload = () => {
                if (transport.responseText === 'only-if-cached')
                    done();
                else
                    done(new Error('request cache-control header sent to server is invalid'));
            };
            let request = new Request('/report-header/cache-control', {
                cache: 'only-if-cached'
            }, () => {}, () => {}, transport);
            request.send();
        });
    });

    describe('#state', function() {

        it(`should return the request current state`, function() {
            let request = new Request('/', {}, () => {}, () => {}, transport);
            expect(request.state).to.equals('0');
        });

        it(`should be updated as the request gets sent, progressing and finally gets to the
        complete state`, function(done) {
            let request = new Request('/', {}, () => {}, () => {}, transport);
            request.send();

            let checkState = () => {
                if (request.state === 'complete')
                    done();
                else
                    setTimeout(checkState, 50);
            };

            setTimeout(checkState, 50);
        });
    });
});