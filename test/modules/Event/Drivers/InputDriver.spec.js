import InputDriver from '../../../../src/modules/Event/Drivers/InputDriver.js';
import UIDriver from '../../../../src/modules/Event/Drivers/UIDriver.js';

describe('Event.Drivers.InputDriver', function() {

    let target = null,
        event = null,
        driver = null;

    beforeEach(function() {
        target = document.createElement('textarea');
        event = InputDriver.create('beforeinput', {});

        target.dispatchEvent(event);
        driver = getInstance(InputDriver, event);
    });

    describe('.events', function() {
        it('should be an array containing event types in the input event interface', function() {
            expect(InputDriver.events).to.be.an('Array').and.that.includes('beforeinput');
        });
    });

    describe('.initEvent(storeIn, getFrom)', function() {
        it(`should initialize the event options according to the InputEvent interface eventInit spec
        and return the result, calling its super class initEvent in the process`, function() {
            let options = InputDriver.initEvent({}, {data: 'K', isComposing: true});
            expect(options.data).to.equals('K');
            expect(options.isComposing).to.be.true;
        });

        it(`should set the data option to empty string when not given`, function() {
            let options = InputDriver.initEvent({}, {});
            expect(options.data).to.equals('');
        });

        it(`should set the isComposing option to false when not given`, function() {
            let options = InputDriver.initEvent({}, {});
            expect(options.isComposing).to.equals(false);
        });
    });

    describe('.create(type, eventInit)', function() {
        it(`should create and return a native InputEvent object of the given type, using the
        optional eventInit options`, function() {
            let event = InputDriver.create('input', {});
            expect(event).to.be.a('InputEvent');
        });
    });

    describe('#constructor(event)', function() {
        it(`should create and return a InputDriver for the given dispatched event`, function() {
            expect(driver).to.be.a('InputDriver');
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

    describe('#isComposing', function() {
        it(`should hold a boolean value that indicates if the event is composing`, function() {
            expect(driver.isComposing).to.equals(false);
        });
    });
});