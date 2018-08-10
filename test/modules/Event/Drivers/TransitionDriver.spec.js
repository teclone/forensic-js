import TransitionDriver from '../../../../src/modules/Event/Drivers/TransitionDriver.js';
import Driver from '../../../../src/modules/Event/Drivers/Driver.js';

describe('Event.Drivers.TransitionDriver', function() {

    let target = null,
        event = null,
        driver = null;

    beforeEach(function() {
        target = document.createElement('form');
        event = TransitionDriver.create('transitionstart', {});

        target.dispatchEvent(event);
        driver = getInstance(TransitionDriver, event);
    });

    describe('.events', function() {
        it('should be an array containing all event types in the TransitionEvent interface', function() {
            expect(TransitionDriver.events).to.be.an('Array').and.lengthOf(4);
        });
    });

    describe('.initEvent(storeIn, getFrom, detail?)', function() {
        it(`should initialize the event options according to the TransitionEvent interface eventInit spec
        and return the result, calling its super class initEvent in the process`, function() {
            let options = TransitionDriver.initEvent({}, {
                propertyName: 'height',
                pseudoElement: '',
                elapsedTime: 3
            });
            expect(options.pseudoElement).to.equals('');
            expect(options.elapsedTime).to.equals(3);
            expect(options.propertyName).to.equals('height');
        });

        it(`should default the pseudoElement to empty string, elapsedTime to 0.0 and propertyName
        to empty when not given`, function() {
            let options = TransitionDriver.initEvent({}, {});

            expect(options.pseudoElement).to.equals('');
            expect(options.elapsedTime).to.equals(0.0);
            expect(options.propertyName).to.equals('');
        });
    });

    describe('.create(type, eventInit?, detail?)', function() {
        it(`should create and return a native TransitionEvent object of the given type, using
        the optional eventInit options`, function() {
            let event = TransitionDriver.create('animationstart', {});
            expect(event).to.be.a('TransitionEvent');
        });
    });

    describe('#constructor(event)', function() {
        it(`should create and return a TransitionDriver for the given dispatched event`, function() {
            expect(driver).to.be.a('TransitionDriver');
        });

        it(`should inherit from Driver`, function() {
            expect(driver).to.be.instanceOf(Driver);
        });
    });

    describe('#pseudoElement', function() {
        it(`should hold the transition css pseudoElement if any`, function() {
            expect(driver.pseudoElement).to.equals('');
        });
    });

    describe('#elapsedTime', function() {
        it(`should hold the elapsed time since the transition has been active before the event
        was fired`, function() {
            expect(driver.elapsedTime).to.equals(0.0);
        });
    });

    describe('#propertyName', function() {
        it(`should hold the transition css longhand property name`, function() {
            expect(driver.propertyName).to.equals('');
        });
    });
});