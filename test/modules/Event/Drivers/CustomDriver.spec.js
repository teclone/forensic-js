import CustomDriver from '../../../../src/modules/Event/Drivers/CustomDriver.js';
import Driver from '../../../../src/modules/Event/Drivers/Driver.js';

describe('Event.Drivers.CustomDriver', function() {

    let target = null,
        event = null,
        driver = null;

    beforeEach(function() {
        target = document.createElement('form');
        event = CustomDriver.create('myevent', {}, 'my-string-data');

        target.dispatchEvent(event);
        driver = getInstance(CustomDriver, event);
    });

    describe('.events', function() {
        it('should be an empty array', function() {
            expect(CustomDriver.events).to.be.an('Array').and.lengthOf(0);
        });
    });

    describe('.initEvent(storeIn, getFrom, detail?)', function() {
        it(`should initialize the event options according to the CustomEvent interface eventInit spec
        and return the result, calling its super class initEvent in the process`, function() {
            let options = CustomDriver.initEvent({}, {bubbles: false, cancelable: false},
                'some-string-data');
            expect(options.detail).to.equals('some-string-data');
            expect(options.bubbles).to.be.false;
        });

        it(`should set the detail option to null if no value is given`, function() {
            let options = CustomDriver.initEvent({}, {});
            expect(options.detail).to.be.null;
        });
    });

    describe('.create(type, eventInit?, detail?)', function() {
        it(`should create and return a native CustomEvent object of the given type, using the optional eventInit
        options and event detail data`, function() {
            let event = CustomDriver.create('play', {});
            expect(event).to.be.a('CustomEvent');
        });
    });

    describe('#constructor(event)', function() {
        it(`should create and return a CustomDriver for the given dispatched event`, function() {
            expect(driver).to.be.a('CustomDriver');
        });

        it(`should inherit from Driver`, function() {
            expect(driver).to.be.instanceOf(Driver);
        });
    });

    describe('#detail', function() {
        it(`should hold the detail data as passed in during the event creation`, function() {
            expect(driver.detail).to.equals('my-string-data');
        });
    });
});