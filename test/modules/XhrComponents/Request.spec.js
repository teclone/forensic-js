import Request from '../../../src/modules/XhrComponents/Request.js';
import Transport from '../../../src/modules/XhrComponents/Transport.js';

describe('XhrComponents.Request', function() {
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

        it(`should set the request withCredentials to the given options.withCredentials boolean
         parameter if given. default value is false`, function() {
            let request = new Request('/', {withCredentials: true}, () => {}, () => {}, transport);
            expect(request.withCredentials).to.equals(true);
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

        it(`should send the request when called and return a promise`, function() {
            let request = new Request('/', {}, () => {}, () => {}, transport);
            expect(request.send()).to.be.a('Promise');
        });

        it(`should send the request, terminating the request if response time exceeds timeout
        value`, function() {
            let request = new Request('/prolong-response', {timeout: 1000}, () => {}, () => {}, transport);
            return request.send().then((request) => {
                expect(request.timedOut).to.be.true;
            });
        });

        it(`should send the request, watching for progress event if an options.progress callback
        method is specified`, function() {
            let callCount = 0;
            let request = new Request('/', {progress: () => {
                callCount += 1;
            }}, () => {}, () => {}, transport);

            return request.send().then(() => {
                expect(callCount).to.be.greaterThan(0);
            });
        });

        it(`should ignore the contentType options and send the request when called,
        sending data content as query parameters if method is neither post nor put`, function() {
            let request = new Request('/report-query', {
                method: 'GET',
                data: {
                    name: 'Harrison',
                    age: 22
                }
            }, () => {}, () => {}, transport);
            return request.send().then((request) => {
                expect(request.transport.responseText).to.equals('{"name":"Harrison","age":"22"}');
            });
        });

        it(`should append the data to the existing query in the url if there is already an
        existing query in the url`, function() {
            let request = new Request('/report-query?name=Harrison', {
                method: 'GET',
                data: {
                    age: 22
                }
            }, () => {}, () => {}, transport);
            return request.send().then((request) => {
                expect(request.transport.responseText).to.equals('{"name":"Harrison","age":"22"}');
            });
        });

        it(`should send the request when called, sending form-urlencoded content to the server if the
        request method is post or put and request data is not a form-data and contentType header
        is not set or is set as 'application/x-www-form-urlencoded'`, function() {
            let request = new Request('/report-header/content-type', {
                method: 'post',
                data: {
                    name: 'Harrison',
                    age: 22
                }
            }, () => {}, () => {}, transport);
            return request.send().then((request) => {
                expect(request.transport.responseText).to.equals('application/x-www-form-urlencoded');
            });
        });

        it(`should send the request when called, sending json content to the server if the
        request method is post or put and contentType header is set as 'json'`, function() {
            let request = new Request('/report-header/content-type', {
                method: 'post',
                contentType: 'json',
                data: {
                    name: 'Harrison',
                    age: 22
                }
            }, () => {}, () => {}, transport);

            return request.send().then((request) => {
                expect(request.transport.responseText).to.equals('application/json');
            });
        });

        it(`should send the request when called, sending json content to the server if the
        request method is post or put and contentType header is set as 'application/json'`, function() {
            let request = new Request('/report-header/content-type', {
                method: 'post',
                contentType: 'application/json',
                data: {
                    name: 'Harrison',
                    age: 22
                }
            }, () => {}, () => {}, transport);

            return request.send().then((request) => {
                expect(request.transport.responseText).to.equals('application/json');
            });
        });

        it(`should send the request when called, sending json content to the server if the
        request method is post or put and contentType header is set as 'text/json'`, function() {
            let request = new Request('/report-header/content-type', {
                method: 'post',
                contentType: 'text/json',
                data: {
                    name: 'Harrison',
                    age: 22
                }
            }, () => {}, () => {}, transport);

            return request.send().then((request) => {
                expect(request.transport.responseText).to.equals('application/json');
            });
        });

        it(`should send the request when called, sending multipart/form-data with boundary token
         to the server if request method is post or put and request data is a form data`, function() {
            let formData = new window.FormData();
            formData.append('name', 'Harrison');

            let request = new Request('/report-header/content-type', {
                method: 'post',
                data: formData
            }, () => {}, () => {}, transport);
            return request.send().then((request) => {
                expect(request.transport.responseText).to.satisfy((text) => {
                    return text.indexOf('multipart/form-data') > -1;
                });
            });
        });

        it(`should send the request when called, sending the appropriate cache-control header
        for the given 'no-store' options.cache value`, function() {
            let request = new Request('/report-header/cache-control', {
                cache: 'no-store'
            }, () => {}, () => {}, transport);
            return request.send().then((request) => {
                expect(request.transport.responseText).to.equals('no-store');
            });
        });

        it(`should send the request when called, sending the appropriate cache-control header
        for the given 'reload' options.cache value`, function() {
            let request = new Request('/report-header/cache-control', {
                cache: 'reload'
            }, () => {}, () => {}, transport);
            return request.send().then((request) => {
                expect(request.transport.responseText).to.equals('no-cache');
            });
        });

        it(`should send the request when called, sending the appropriate cache-control header
        for the given 'no-cache' options.cache value`, function() {
            let request = new Request('/report-header/cache-control', {
                cache: 'no-cache'
            }, () => {}, () => {}, transport);

            return request.send().then((request) => {
                expect(request.transport.responseText).to.equals('no-cache');
            });
        });

        it(`should send the request when called, sending the appropriate cache-control header
        for the given 'force-cache' options.cache value`, function() {
            let request = new Request('/report-header/cache-control', {
                cache: 'force-cache'
            }, () => {}, () => {}, transport);

            return request.send().then((request) => {
                expect(['no-cache', 'max-stale']).to.include(request.transport.responseText);
            });
        });

        it(`should send the request when called, sending the appropriate cache-control header
        for the given 'only-if-cached' options.cache value`, function() {
            let request = new Request('/report-header/cache-control', {
                cache: 'only-if-cached'
            }, () => {}, () => {}, transport);

            return request.send().then((request) => {
                expect(request.transport.responseText).to.equals('only-if-cached');
            });
        });
    });

    describe('#abort()', function() {

        it(`should abort the request when called`, function() {
            let request = new Request('/', {}, () => {}, () => {}, transport);

            let promise = request.send().then((request) => {
                expect(request.aborted).to.equals(true);
                expect(request.state).to.equals('complete');
            });

            request.abort();

            return promise;
        });
    });

    describe('#state', function() {

        it(`should return the request current state`, function() {
            let request = new Request('/', {}, () => {}, () => {}, transport);
            expect(request.state).to.equals('0');
        });

        it(`should be updated as the request gets sent, progressing and finally gets to the
        complete state`, function() {
            let request = new Request('/', {}, () => {}, () => {}, transport);
            return request.send().then((request) => {
                expect(request.state).to.equals('complete');
            });
        });
    });
});