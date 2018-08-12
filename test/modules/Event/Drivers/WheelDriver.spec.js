import WheelDriver from '../../../../src/modules/Event/Drivers/WheelDriver.js';
import MouseDriver from '../../../../src/modules/Event/Drivers/MouseDriver.js';

describe('Event.Drivers.WheelDriver', function() {

    let target = null,
        event = null,
        driver = null;

    beforeEach(function() {
        target = window;
        event = WheelDriver.create('wheel', {});

        target.dispatchEvent(event);
        driver = getInstance(WheelDriver, event);
    });

    describe('.events', function() {
        it('should be an array containing event types in the wheel event interface', function() {
            expect(WheelDriver.events).to.be.an('Array').and.that.includes('wheel');
        });
    });

    describe('.initEvent(storeIn, getFrom)', function() {
        it(`should initialize the event options according to the WheelEvent interface eventInit spec
        and return the result, calling its super class initEvent in the process`, function() {
            let options = WheelDriver.initEvent({}, {
                deltaX: 10,
                deltaY: 20,
                deltaZ: 3,
                deltaMode: 0
            });

            expect(options.deltaX).to.equals(10);
            expect(options.deltaY).to.equals(20);

            expect(options.deltaZ).to.equals(3);
            expect(options.deltaMode).to.equals(0);
        });

        it(`should set the deltaX option to 0 when not given`, function() {
            let options = WheelDriver.initEvent({}, {});
            expect(options.deltaX).to.equals(0);
        });

        it(`should set the deltaY option to 0 when not given`, function() {
            let options = WheelDriver.initEvent({}, {});
            expect(options.deltaY).to.equals(0);
        });

        it(`should set the deltaZ option to 0 when not given`, function() {
            let options = WheelDriver.initEvent({}, {});
            expect(options.deltaZ).to.equals(0);
        });

        it(`should set the deltaMode option to 0 when not given`, function() {
            let options = WheelDriver.initEvent({}, {});
            expect(options.deltaMode).to.equals(0);
        });
    });

    describe('.create(type, eventInit?)', function() {
        it(`should create and return a native WheelEvent object of the given type, using the
        optional eventInit options`, function() {
            let event = WheelDriver.create('wheel', {});
            expect(event).to.be.a('WheelEvent');
        });
    });

    describe('#constructor(event)', function() {
        it(`should create and return a WheelDriver for the given dispatched event`, function() {
            expect(driver).to.be.a('WheelDriver');
        });

        it(`should inherit from MouseDriver`, function() {
            expect(driver).to.be.instanceOf(MouseDriver);
        });
    });

    describe('#deltaX', function() {
        it(`should hold the measurement in the X cordinate direction that would
        scrolled if event has not been cancelled`, function() {
            expect(driver.deltaX).to.equals(0);
        });
    });

    describe('#deltaY', function() {
        it(`should hold the measurement in the Y cordinate direction that would
        scrolled if event has not been cancelled`, function() {
            expect(driver.deltaY).to.equals(0);
        });
    });

    describe('#deltaZ', function() {
        it(`should hold the measurement in the Z cordinate direction that would
        scrolled if event has not been cancelled`, function() {
            expect(driver.deltaZ).to.equals(0);
        });
    });

    describe('#deltaMode', function() {
        it(`should hold the mode of measurement used for all the delta properties`, function() {
            expect(driver.deltaMode).to.equals(0);
        });
    });
});