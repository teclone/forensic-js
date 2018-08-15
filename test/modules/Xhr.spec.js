import Xhr from '../../src/modules/Xhr.js';

describe('Xhr', function() {

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

    describe('.install(hostParam, rootParam)', function() {
        it('should call the global install method with the given parameter', function() {
            expect(Xhr.install(window, document)).to.be.false;
        });
    });

    describe('.uninstall()', function() {
        it('should call the global uninstall method', function() {
            expect(Xhr.uninstall()).to.be.true;
            expect(Xhr.install(window, document)).to.be.true;
        });
    });

    describe('.fetch(url, options?)', function() {

        it('should send request to the resource at the given url and return a promise', function() {
            expect(Xhr.fetch('/')).to.be.a('promise');
        });

        it('should pass in a reponse object to the then callback', function() {
            return Xhr.fetch('/').then(response => {
                expect(response).to.be.a('Response');
            });
        });

        it('should accept an optional request options object as second parameter as covered in the Request module', function() {
            return Xhr.fetch('/', {}).then(response => {
                expect(response).to.be.a('Response');
            });
        });

        it(`should reject the response if response status code is not within the 200 range and it
        is not a 304 status code`, function() {
            return Xhr.fetch('unexisting-file.html').catch(response => {
                expect(response.statusCode).equals(404);
            });
        });
    });

    describe('.get(url, options?)', function() {
        it('should send request to the resource at the given url using the GET method verb', function() {
            return Xhr.get('report/request-method').then((response) => {
                expect(response.getHeaders().xRequestMethod).to.equals('GET');
            });
        });
    });

    describe('.post(url, options?)', function() {
        it('should send request to the resource at the given url using the POST method verb', function() {
            return Xhr.post('report/request-method').then((response) => {
                expect(response.getHeaders().xRequestMethod).to.equals('POST');
            });
        });
    });

    describe('.put(url, options?)', function() {
        it('should send request to the resource at the given url using the PUT method verb', function() {
            return Xhr.put('report/request-method').then((response) => {
                expect(response.getHeaders().xRequestMethod).to.equals('PUT');
            });
        });
    });

    describe('.delete(url, options?)', function() {
        it('should send request to the resource at the given url using the DELETE method verb', function() {
            return Xhr.delete('report/request-method').then((response) => {
                expect(response.getHeaders().xRequestMethod).to.equals('DELETE');
            });
        });
    });

    describe('.options(url, options?)', function() {
        it('should send request to the resource at the given url using the OPTIONS method verb', function() {
            return Xhr.options('report/request-method').then((response) => {
                expect(response.getHeaders().xRequestMethod).to.equals('OPTIONS');
            });
        });
    });

    describe('.head(url, options?)', function() {
        it('should send request to the resource at the given url using the HEAD method verb', function() {
            return Xhr.head('report/request-method').then((response) => {
                expect(response.getHeaders().xRequestMethod).to.equals('HEAD');
            });
        });
    });

    describe('.timeoutAfter(ms?)', function() {
        it(`should return the default request timeout value in milliseconds if no milliseconds
        time argument is passed in. The default value is 15 seconds`, function() {
            expect(Xhr.timeoutAfter()).to.equals(15000);
        });

        it(`should set the default request timeout value to the passed in milliseconds
        time argument`, function() {
            Xhr.timeoutAfter(10000);
            expect(Xhr.timeoutAfter()).to.equals(10000);

            //set it back
            Xhr.timeoutAfter(15000);
        });
    });

    describe('.pollAfter(ms?)', function() {
        it(`should return the default time in milliseconds that the module waits before polling
        for the next request if no milliseconds time argument is supplied. Default value is 250
        milliseconds`, function() {
            expect(Xhr.pollAfter()).to.equals(250);
        });

        it(`should set the default time in milliseconds that the module waits before polling
        for the next request to the given milliseconds time argument.`, function() {
            Xhr.pollAfter(500);
            expect(Xhr.pollAfter()).to.equals(500);

            //set it back
            Xhr.pollAfter(250);
        });
    });

    describe('.promoteAfter(ms?)', function() {
        it(`should return the default time in milliseconds that a pending request must stay
        before its priority is promoted one step higher if no milliseconds time argument is
        supplied. Default value is 3000 milliseconds`, function() {
            expect(Xhr.promoteAfter()).to.equals(3000);
        });

        it(`should set the default time in milliseconds that a pending request must have stay
        before its priority is promoted one step higher to the given milliseconds time argument.`, function() {
            //set the value to something lesser than poll time
            Xhr.promoteAfter(150);
            expect(Xhr.promoteAfter()).to.equals(150);

            return Xhr.fetch('/').then(() => {
                //do nothing. just want to cover request age decrementing
                Xhr.promoteAfter(3000);
            });
        });
    });

    describe('.supported', function() {
        it('it should hold a boolean value that indicates if XMLHttpRequest is supported', function() {
            expect(Xhr.supported).to.be.true;
        });
    });

    describe('.ieString', function() {
        it(`should hold the MSXML version string used in creating the request transport if
        the environment is running in a trident engine that implements XMLHttpRequest through
        ActiveXObject`, function() {
            expect(Xhr.ieString).to.be.a('string');
        });
    });

    describe('.addHeader(name, value)', function() {
        it(`should add a global header whose name is the given name that will get sent for all
        http request made using the module.`, function() {
            Xhr.addHeader('X-Requested-With', 'XMLHttpRequest');
            return Xhr.fetch('report-header/x-requested-with').then((response) => {
                expect(response.text()).to.equals('XMLHttpRequest');
            });
        });
    });

    describe('.addHeaders(entries)', function() {
        it(`should add multiple global headers using the entries' key:value pairs
        that will get sent for all http request made using the module.`, function() {
            Xhr.addHeaders({
                'X-CSRF-TOKEN': 'random_token'
            });
            return Xhr.fetch('report-header/x-csrf-token').then((response) => {
                expect(response.text()).to.equals('random_token');
            });
        });
    });

    describe('.removeHeader(headerName)', function() {
        it(`should remove the given header from the global headers list when called`, function() {
            Xhr.removeHeader('X-CSRF-TOKEN');
            return Xhr.fetch('report-header/x-csrf-token').then((response) => {
                expect(response.text()).to.equals('undefined');
            });
        });
    });

    describe('.removeHeaders(...headerNames)', function() {
        it(`should remove the comma separated list of headers from the global headers list when
        called`, function() {
            Xhr.removeHeaders('X-Requested-With');
            return Xhr.fetch('report-header/x-request-with').then((response) => {
                expect(response.text()).to.equals('undefined');
            });
        });
    });
});