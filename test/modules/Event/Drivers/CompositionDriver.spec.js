import CompositionDriver from '../../../../src/modules/Event/Drivers/CompositionDriver.js';
import UIDriver from '../../../../src/modules/Event/Drivers/UIDriver.js';

describe('Event.Drivers.CompositionDriver', function() {

    let target = null,
        event = null,
        driver = null;

    beforeEach(function() {
        target = document.createElement('textarea');
        event = CompositionDriver.create('compositionstart', {});

        target.dispatchEvent(event);
        driver = getInstance(CompositionDriver, event);
    });

    describe('.events', function() {
        it('should be an array containing event types in the composition event interface', function() {
            expect(CompositionDriver.events).to.be.an('Array').and.that.includes('compositionstart');
        });
    });

    describe('.initEvent(storeIn, getFrom)', function() {
        it(`should initialize the event options according to the CompositionEvent interface eventInit spec
        and return the result, calling its super class initEvent in the process`, function() {
            let options = CompositionDriver.initEvent({}, {data: 'K'});
            expect(options.data).to.equals('K');
        });

        it(`should set the data option to empty string when not given`, function() {
            let options = CompositionDriver.initEvent({}, {});
            expect(options.data).to.equals('');
        });
    });

    describe('.create(type, eventInit)', function() {
        it(`should create and return a native CompositionEvent object of the given type, using the
        optional eventInit options`, function() {
            let event = CompositionDriver.create('compositionupdate', {});
            expect(event).to.be.a('CompositionEvent');
        });
    });

    describe('#constructor(event)', function() {
        it(`should create and return a CompositionDriver for the given dispatched event`, function() {
            expect(driver).to.be.a('CompositionDriver');
        });

        it(`should inherit from UIDriver`, function() {
            expect(driver).to.be.instanceOf(UIDriver);
        });
    });

    describe('#data', function() {
        it(`should hold the event's data value as passed in during the event creation`, function() {
            expect(driver.data).to.equals('');
        });
    });
});