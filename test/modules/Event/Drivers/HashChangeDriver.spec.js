import HashChangeDriver from '../../../../src/modules/Event/Drivers/HashChangeDriver.js';
import Driver from '../../../../src/modules/Event/Drivers/Driver.js';

describe('Event.Drivers.HashChangeDriver', function() {

    let target = null,
        event = null,
        driver = null;

    beforeEach(function() {
        target = window;
        event = HashChangeDriver.create('hashchange', {});

        target.dispatchEvent(event);
        driver = getInstance(HashChangeDriver, event);
    });

    describe('.events', function() {
        it('should hold the list of events in the hash change event interface', function() {
            expect(HashChangeDriver.events).to.be.an('Array').and.lengthOf(1);
        });
    });

    describe('.initEvent(storeIn, getFrom)', function() {
        it(`should initialize the event options according to the HashChangeEvent interface eventInit spec
        and return the result, calling its super class initEvent in the process`, function() {
            let options = HashChangeDriver.initEvent({}, {oldURL: 'url#old', newURL: 'url#new'});

            expect(options.oldURL).to.equals('url#old');
            expect(options.newURL).to.equals('url#new');
        });

        it(`should set the oldURL option to empty string if no value is given`, function() {
            let options = HashChangeDriver.initEvent({}, {});
            expect(options.oldURL).to.equals('');
        });

        it(`should set the newURL option to empty string if no value is given`, function() {
            let options = HashChangeDriver.initEvent({}, {});
            expect(options.newURL).to.equals('');
        });
    });

    describe('.create(type, eventInit)', function() {
        it(`should create and return a native HashChangeEvent object of the given type, using
        the optional haschange eventInit options`, function() {
            let event = HashChangeDriver.create('play', {});
            expect(event).to.be.a('HashChangeEvent');
        });
    });

    describe('#constructor(event)', function() {
        it(`should create and return a HashChangeDriver for the given dispatched event`, function() {
            expect(driver).to.be.a('HashChangeDriver');
        });

        it(`should inherit from Driver`, function() {
            expect(driver).to.be.instanceOf(Driver);
        });
    });

    describe('#oldURL', function() {
        it(`should hold the old url as passed in during the event creation`, function() {
            expect(driver.oldURL).to.equals('');
        });
    });

    describe('#newURL', function() {
        it(`should hold the new url as passed in during the event creation`, function() {
            expect(driver.newURL).to.equals('');
        });
    });
});