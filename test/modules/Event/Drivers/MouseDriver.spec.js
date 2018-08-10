import MouseDriver from '../../../../src/modules/Event/Drivers/MouseDriver.js';
import UIDriver from '../../../../src/modules/Event/Drivers/UIDriver.js';

describe('Event.Drivers.MouseDriver', function() {

    let target = null,
        event = null,
        driver = null;

    beforeEach(function() {
        target = window;
        event = MouseDriver.create('mousemove', {});

        target.dispatchEvent(event);
        driver = getInstance(MouseDriver, event);
    });

    describe('.events', function() {
        it('should be an array containing event types in the mouse event interface', function() {
            expect(MouseDriver.events).to.be.an('Array').and.that.includes('mouseover');
        });
    });

    describe('.initEvent(storeIn, getFrom)', function() {
        it(`should initialize the event options according to the MouseEvent interface eventInit spec
        and return the result, calling its super class initEvent in the process`, function() {
            let options = MouseDriver.initEvent({}, {
                screenX: 200,
                screenY: 500,
                clientX: 180,
                clientY: 480,
                ctrlKey: true,
                altKey: true,
                shiftKey: true,
                metaKey: true,
                button: 0,
                relatedTarget: window
            });

            expect(options.screenX).to.equals(200);
            expect(options.screenY).to.equals(500);

            expect(options.clientX).to.equals(180);
            expect(options.clientY).to.equals(480);

            expect(options.ctrlKey).to.equals(true);
            expect(options.altKey).to.equals(true);
            expect(options.shiftKey).to.equals(true);
            expect(options.metaKey).to.equals(true);

            expect(options.button).to.equals(0);

            expect(options.relatedTarget).to.equals(window);
        });

        it(`should set the clientX option to 0 when not given`, function() {
            let options = MouseDriver.initEvent({}, {});
            expect(options.clientX).to.be.equals(0);
        });

        it(`should set the clientY option to 0 when not given`, function() {
            let options = MouseDriver.initEvent({}, {});
            expect(options.clientY).to.be.equals(0);
        });

        it(`should set the screenX option to 0 when not given`, function() {
            let options = MouseDriver.initEvent({}, {});
            expect(options.screenX).to.be.equals(0);
        });

        it(`should set the screenY option to 0 when not given`, function() {
            let options = MouseDriver.initEvent({}, {});
            expect(options.screenY).to.be.equals(0);
        });

        it(`should set the ctrlKey option to false when not given`, function() {
            let options = MouseDriver.initEvent({}, {});
            expect(options.ctrlKey).to.be.equals(false);
        });

        it(`should set the altKey option to false when not given`, function() {
            let options = MouseDriver.initEvent({}, {});
            expect(options.altKey).to.be.equals(false);
        });

        it(`should set the metaKey option to false when not given`, function() {
            let options = MouseDriver.initEvent({}, {});
            expect(options.metaKey).to.be.equals(false);
        });

        it(`should set the shiftKey option to false when not given`, function() {
            let options = MouseDriver.initEvent({}, {});
            expect(options.shiftKey).to.be.equals(false);
        });

        it(`should set the button option to 0 when not given`, function() {
            let options = MouseDriver.initEvent({}, {});
            expect(options.button).to.be.equals(0);
        });

        it(`should set the relatedTarget option to null when not given`, function() {
            let options = MouseDriver.initEvent({}, {});
            expect(options.relatedTarget).to.be.null;
        });
    });

    describe('.create(type, eventInit?)', function() {
        it(`should create and return a native UIEvent object of the given type, using the
        optional eventInit options`, function() {
            let event = MouseDriver.create('focusin', {});
            expect(event).to.be.a('MouseEvent');
        });
    });

    describe('#constructor(event)', function() {
        it(`should create and return a MouseDriver for the given dispatched event`, function() {
            expect(driver).to.be.a('MouseDriver');
        });

        it(`should inherit from UIDriver`, function() {
            expect(driver).to.be.instanceOf(UIDriver);
        });
    });

    describe('#clientX', function() {
        it(`should hold the X cordinate of the mouse in relation to the browser viewport`, function() {
            expect(driver.clientX).to.be.equals(0);
        });
    });

    describe('#clientY', function() {
        it(`should hold the Y cordinate of the mouse in relation to the browser viewport`, function() {
            expect(driver.clientY).to.be.equals(0);
        });
    });

    describe('#screenX', function() {
        it(`should hold the X cordinate of the mouse in relation to the device physical screen`, function() {
            expect(driver.screenX).to.be.equals(0);
        });
    });

    describe('#screenY', function() {
        it(`should hold the Y cordinate of the mouse in relation to the device physical screen`, function() {
            expect(driver.screenY).to.be.equals(0);
        });
    });

    describe('#ctrlKey', function() {
        it(`should hold a boolean value indicating if the control key was activated during the
        event`, function() {
            expect(driver.ctrlKey).to.be.equals(false);
        });
    });

    describe('#shiftKey', function() {
        it(`should hold a boolean value indicating if the shift key was activated during the
        event`, function() {
            expect(driver.shiftKey).to.be.equals(false);
        });
    });

    describe('#metaKey', function() {
        it(`should hold a boolean value indicating if the meta key was activated during the
        event`, function() {
            expect(driver.metaKey).to.be.equals(false);
        });
    });

    describe('#altKey', function() {
        it(`should hold a boolean value indicating if the alternate key was activated during the
        event`, function() {
            expect(driver.altKey).to.be.equals(false);
        });
    });

    describe('#button', function() {
        it(`should hold an integer value that indicates the mouse button that was pressed.`, function() {
            expect(driver.button).to.be.equals(0);
        });
    });

    describe('#buttons', function() {
        it(`should hold an integer value that indicates a bitwise combination of the mouse buttons
        that were active in the cause of the event.`, function() {
            expect(driver.buttons).to.be.equals(0);
        });
    });

    describe('#relatedTarget', function() {
        it(`should hold the event's relatedTarget as passed in during the event creation`, function() {
            expect(driver.relatedTarget).to.be.null;
        });
    });
});