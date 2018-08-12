import PopStateDriver from '../../../../src/modules/Event/Drivers/PopStateDriver.js';
import Driver from '../../../../src/modules/Event/Drivers/Driver.js';

describe('Event.Drivers.PopStateDriver', function() {

    let target = null,
        event = null,
        driver = null;

    beforeEach(function() {
        target = window;
        event = PopStateDriver.create('popstate', {});

        target.dispatchEvent(event);
        driver = getInstance(PopStateDriver, event);
    });

    describe('.events', function() {
        it('should hold the list of events in the popstate event interface', function() {
            expect(PopStateDriver.events).to.be.an('Array').and.lengthOf(1);
        });
    });

    describe('.initEvent(storeIn, getFrom)', function() {
        it(`should initialize the event options according to the PopStateEvent interface eventInit spec
        and return the result, calling its super class initEvent in the process`, function() {
            let options = PopStateDriver.initEvent({}, {state: 'nothing'});

            expect(options.state).to.equals('nothing');
        });

        it(`should set the state option to null if no value is given`, function() {
            let options = PopStateDriver.initEvent({}, {});
            expect(options.state).to.be.null;
        });
    });

    describe('.create(type, eventInit)', function() {
        it(`should create and return a native PopStateEvent object of the given type, using
        the optional page transition eventInit options`, function() {
            let event = PopStateDriver.create('popstate', {});
            expect(event).to.be.a('PopStateEvent');
        });
    });

    describe('#constructor(event)', function() {
        it(`should create and return a PopStateDriver for the given dispatched event`, function() {
            expect(driver).to.be.a('PopStateDriver');
        });

        it(`should inherit from Driver`, function() {
            expect(driver).to.be.instanceOf(Driver);
        });
    });

    describe('#state', function() {
        it(`should return the event state as passed in by pushState or replaceState`, function() {
            expect(driver.state).to.be.null;
        });
    });
});