import FocusDriver from '../../../../src/modules/Event/Drivers/FocusDriver.js';
import UIDriver from '../../../../src/modules/Event/Drivers/UIDriver.js';

describe('Event.Drivers.FocusDriver', function() {

    let target = null,
        event = null,
        driver = null;

    beforeEach(function() {
        target = window;
        event = FocusDriver.create('blur', {});

        target.dispatchEvent(event);
        driver = getInstance(FocusDriver, event);
    });

    describe('.events', function() {
        it('should be an array containing event types in the focus event interface', function() {
            expect(FocusDriver.events).to.be.an('Array').and.that.includes('blur');
        });
    });

    describe('.initEvent(storeIn, getFrom)', function() {
        it(`should initialize the event options according to the FocusEvent interface eventInit spec
        and return the result, calling its super class initEvent in the process`, function() {
            let options = FocusDriver.initEvent({}, {relatedTarget: window});
            expect(options.relatedTarget).to.equals(window);
        });

        it(`should set the relatedTarget option to null when not given`, function() {
            let options = FocusDriver.initEvent({}, {});
            expect(options.relatedTarget).to.be.null;
        });
    });

    describe('.create(type, eventInit?)', function() {
        it(`should create and return a native FocusEvent object of the given type, using the
        optional eventInit options`, function() {
            let event = FocusDriver.create('focusin', {});
            expect(event).to.be.a('FocusEvent');
        });
    });

    describe('#constructor(event)', function() {
        it(`should create and return a FocusDriver for the given dispatched event`, function() {
            expect(driver).to.be.a('FocusDriver');
        });

        it(`should inherit from UIDriver`, function() {
            expect(driver).to.be.instanceOf(UIDriver);
        });
    });

    describe('#relatedTarget', function() {
        it(`should hold the event's relatedTarget as passed in during the event creation`, function() {
            expect(driver.relatedTarget).to.be.null;
        });
    });
});