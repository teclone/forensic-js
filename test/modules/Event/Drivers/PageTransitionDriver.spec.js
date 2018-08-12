import PageTransitionDriver from '../../../../src/modules/Event/Drivers/PageTransitionDriver.js';
import Driver from '../../../../src/modules/Event/Drivers/Driver.js';

describe('Event.Drivers.PageTransitionDriver', function() {

    let target = null,
        event = null,
        driver = null;

    beforeEach(function() {
        target = window;
        event = PageTransitionDriver.create('pageshow', {});

        target.dispatchEvent(event);
        driver = getInstance(PageTransitionDriver, event);
    });

    describe('.events', function() {
        it('should hold the list of events in the page transition event interface', function() {
            expect(PageTransitionDriver.events).to.be.an('Array').and.lengthOf(2);
        });
    });

    describe('.initEvent(storeIn, getFrom)', function() {
        it(`should initialize the event options according to the PageTransitionEvent interface eventInit spec
        and return the result, calling its super class initEvent in the process`, function() {
            let options = PageTransitionDriver.initEvent({}, {persisted: true});

            expect(options.persisted).to.be.true;
        });

        it(`should set the persisted option to false if no value is given`, function() {
            let options = PageTransitionDriver.initEvent({}, {});
            expect(options.persisted).to.be.false;
        });
    });

    describe('.create(type, eventInit)', function() {
        it(`should create and return a native PageTransitionEvent object of the given type, using
        the optional page transition eventInit options`, function() {
            let event = PageTransitionDriver.create('pagehide', {});
            expect(event).to.be.a('PageTransitionEvent');
        });
    });

    describe('#constructor(event)', function() {
        it(`should create and return a PageTransitionDriver for the given dispatched event`, function() {
            expect(driver).to.be.a('PageTransitionDriver');
        });

        it(`should inherit from Driver`, function() {
            expect(driver).to.be.instanceOf(Driver);
        });
    });

    describe('#persisted', function() {
        it(`should hold a boolean value indicating if the page is loading for the first time
        (false) for pageshow event, or if the page is going out for the last time (true) for
        pagehide`, function() {
            expect(driver.persisted).to.equals(false);
        });
    });
});