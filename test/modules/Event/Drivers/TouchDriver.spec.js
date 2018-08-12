import TouchDriver from '../../../../src/modules/Event/Drivers/TouchDriver.js';
import UIDriver from '../../../../src/modules/Event/Drivers/UIDriver.js';

describe('Event.Drivers.TouchDriver', function() {

    let target = null,
        event = null,
        driver = null;

    beforeEach(function() {
        target = window;
        event = TouchDriver.create('touchstart', {});

        target.dispatchEvent(event);
        driver = getInstance(TouchDriver, event);
    });

    describe('.events', function() {
        it('should be an array containing event types in the touch event interface', function() {
            expect(TouchDriver.events).to.be.an('Array').and.lengthOf(4);
        });
    });

    describe('.initEvent(storeIn, getFrom)', function() {
        it(`should initialize the event options according to the TouchEvent interface eventInit spec
        and return the result, calling its super class initEvent in the process`, function() {
            let options = TouchDriver.initEvent({}, {touches: [], changedTouches: [], targetTouches: []});

            expect(options.touches).to.be.lengthOf(0);
            expect(options.changedTouches).to.be.lengthOf(0);
            expect(options.targetTouches).to.be.lengthOf(0);
        });

        it(`should set the touches option to empty array when not given`, function() {
            let options = TouchDriver.initEvent({}, {});
            expect(options.touches).to.be.an('Array').and.lengthOf(0);
        });

        it(`should set the changedTouches option to empty array when not given`, function() {
            let options = TouchDriver.initEvent({}, {});
            expect(options.changedTouches).to.be.an('Array').and.lengthOf(0);
        });

        it(`should set the targetTouches option to empty array when not given`, function() {
            let options = TouchDriver.initEvent({}, {});
            expect(options.targetTouches).to.be.an('Array').and.lengthOf(0);
        });
    });

    describe('.create(type, eventInit?)', function() {
        it(`should create and return a native TouchEvent object of the given type, using the
        optional eventInit options`, function() {
            let event = TouchDriver.create('touchmove', {});
            expect(event).to.be.a('TouchEvent');
        });
    });

    describe('#constructor(event)', function() {
        it(`should create and return a TouchDriver for the given dispatched event`, function() {
            expect(driver).to.be.a('TouchDriver');
        });

        it(`should inherit from UIDriver`, function() {
            expect(driver).to.be.instanceOf(UIDriver);
        });
    });

    describe('#touches', function() {
        it(`should hold the event's sequence of touches as passed in during the event creation`, function() {
            expect(driver.touches).to.be.lengthOf(0);
        });
    });

    describe('#targetTouches', function() {
        it(`should hold the event's sequence of target touches as passed in during the event creation`, function() {
            expect(driver.targetTouches).to.be.lengthOf(0);
        });
    });

    describe('#changedTouches', function() {
        it(`should hold the event's sequence of changed touches as passed in during the event creation`, function() {
            expect(driver.changedTouches).to.be.lengthOf(0);
        });
    });

    describe('#ctrlKey', function() {
        it(`should hold a boolean value indicating if the control key was activated during the
        event`, function() {
            expect(driver.ctrlKey).to.equals(false);
        });
    });

    describe('#shiftKey', function() {
        it(`should hold a boolean value indicating if the shift key was activated during the
        event`, function() {
            expect(driver.shiftKey).to.equals(false);
        });
    });

    describe('#metaKey', function() {
        it(`should hold a boolean value indicating if the meta key was activated during the
        event`, function() {
            expect(driver.metaKey).to.equals(false);
        });
    });

    describe('#altKey', function() {
        it(`should hold a boolean value indicating if the alternate key was activated during the
        event`, function() {
            expect(driver.altKey).to.equals(false);
        });
    });
});