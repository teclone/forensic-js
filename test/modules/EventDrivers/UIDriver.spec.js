import UIDriver from '../../../src/modules/EventDrivers/UIDriver.js';
import Driver from '../../../src/modules/EventDrivers/Driver.js';

describe('EventDrivers.UIDriver', function() {

    let target = null,
        event = null,
        driver = null;

    beforeEach(function() {
        target = window;
        event = UIDriver.create('load', {});

        target.dispatchEvent(event);
        driver = getInstance(UIDriver, event);
    });

    describe('.events', function() {
        it('should be an array containing event types in the ui event interface', function() {
            expect(UIDriver.events).to.be.an('Array').and.that.includes('load');
        });
    });

    describe('.initEvent(storeIn, getFrom)', function() {
        it(`should initialize the event options according to the UIEvent interface eventInit spec
        and return the result, calling its super class initEvent in the process`, function() {
            let options = UIDriver.initEvent({}, {view: window, detail: 1});
            expect(options.detail).to.equals(1);
            expect(options.view).to.equals(window);
        });

        it(`should set the detail option to 0, the view to null when not given`, function() {
            let options = UIDriver.initEvent({}, {});
            expect(options.detail).to.equals(0);
            expect(options.view).to.be.null;
        });
    });

    describe('.create(type, eventInit?, detail?)', function() {
        it(`should create and return a native UIEvent object of the given type, using the optional eventInit
        options and event detail data`, function() {
            let event = UIDriver.create('play', {});
            expect(event).to.be.a('UIEvent');
        });
    });

    describe('#constructor(event)', function() {
        it(`should create and return a UIDriver for the given dispatched event`, function() {
            expect(driver).to.be.a('UIDriver');
        });

        it(`should inherit from Driver`, function() {
            expect(driver).to.be.instanceOf(Driver);
        });
    });

    describe('#view', function() {
        it(`should hold the event's window proxy data as passed in during the event creation`, function() {
            expect(driver.view).to.be.null;
        });
    });

    describe('#detail', function() {
        it(`should hold the detail option property as passed in during the event creation or as
        determined by the user agent for trusted events`, function() {
            expect(driver.detail).to.equals(0);
        });
    });
});