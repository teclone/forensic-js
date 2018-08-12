import KeyboardDriver from '../../../../src/modules/Event/Drivers/KeyboardDriver.js';
import UIDriver from '../../../../src/modules/Event/Drivers/UIDriver.js';

describe('Event.Drivers.KeyboardDriver', function() {

    let target = null,
        event = null,
        driver = null;

    beforeEach(function() {
        target = window;
        event = KeyboardDriver.create('keydown', {});

        target.dispatchEvent(event);
        driver = getInstance(KeyboardDriver, event);
    });

    describe('.events', function() {
        it('should be an array containing event types in the keyboard event interface', function() {
            expect(KeyboardDriver.events).to.be.an('Array').and.that.includes('keydown');
        });
    });

    describe('.initEvent(storeIn, getFrom)', function() {
        it(`should initialize the event options according to the KeyboardEvent interface eventInit spec
        and return the result, calling its super class initEvent in the process`, function() {
            let options = KeyboardDriver.initEvent({}, {key: 'K', code: 'KeyK', repeat: true,
                isComposing: true, location: 1});

            expect(options.key).to.equals('K');
            expect(options.repeat).to.equals(true);
            expect(options.location).to.equals(1);
            expect(options.isComposing).to.equals(true);
            expect(options.code).to.equals('KeyK');
        });

        it(`should set the key option to empty string when not given`, function() {
            let options = KeyboardDriver.initEvent({}, {});
            expect(options.key).to.equals('');
        });

        it(`should set the code option to empty string when not given`, function() {
            let options = KeyboardDriver.initEvent({}, {});
            expect(options.code).to.equals('');
        });

        it(`should set the location option to 0 when not given`, function() {
            let options = KeyboardDriver.initEvent({}, {});
            expect(options.location).to.equals(0);
        });

        it(`should set the repeat option to false when not given`, function() {
            let options = KeyboardDriver.initEvent({}, {});
            expect(options.repeat).to.equals(false);
        });

        it(`should set the isComposing option to false when not given`, function() {
            let options = KeyboardDriver.initEvent({}, {});
            expect(options.isComposing).to.equals(false);
        });
    });

    describe('.create(type, eventInit?)', function() {
        it(`should create and return a native KeyboardEvent object of the given type, using the
        optional eventInit options`, function() {
            let event = KeyboardDriver.create('keydown', {});
            expect(event).to.be.a('KeyboardEvent');
        });
    });

    describe('#constructor(event)', function() {
        it(`should create and return a KeyboardDriver for the given dispatched event`, function() {
            expect(driver).to.be.a('KeyboardDriver');
        });

        it(`should inherit from UIDriver`, function() {
            expect(driver).to.be.instanceOf(UIDriver);
        });
    });

    describe('#repeat', function() {
        it(`should hold boolean value indicating if event is repeating`, function() {
            expect(driver.repeat).to.equals(false);
        });
    });

    describe('#location', function() {
        it(`should hold the key's keyboard location long value`, function() {
            expect(driver.location).to.equals(0);
        });
    });

    describe('#isComposing', function() {
        it(`should hold a boolean value that indicates if the event is composing`, function() {
            expect(driver.isComposing).to.equals(false);
        });
    });

    describe('#key', function() {
        it(`should hold the keyboard event final key value`, function() {
            expect(driver.key).to.equals('');
        });
    });

    describe('#code', function() {
        it(`should hold the keyboard event key unicode point value`, function() {
            expect(driver.code).to.equals('');
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

    describe('#getModifierState(modifierKey)', function() {
        it(`should return a boolean value indicating if the passed in modifier key exists`, function() {
            expect(driver.getModifierState('ScrollLock')).to.equals(false);
            expect(driver.getModifierState('Shift')).to.equals(false);
        });
    });
});