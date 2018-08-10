import AnimationDriver from '../../../../src/modules/Event/Drivers/AnimationDriver.js';
import Driver from '../../../../src/modules/Event/Drivers/Driver.js';

describe('Event.Drivers.AnimationDriver', function() {

    let target = null,
        event = null,
        driver = null;

    beforeEach(function() {
        target = document.createElement('form');
        event = AnimationDriver.create('animationstart', {});

        target.dispatchEvent(event);
        driver = getInstance(AnimationDriver, event);
    });

    describe('.events', function() {
        it('should be an array containing all event types in the AnimationEvent interface', function() {
            expect(AnimationDriver.events).to.be.an('Array').and.lengthOf(4);
        });
    });

    describe('.initEvent(storeIn, getFrom, detail?)', function() {
        it(`should initialize the event options according to the AnimationEvent interface eventInit spec
        and return the result, calling its super class initEvent in the process`, function() {
            let options = AnimationDriver.initEvent({}, {
                animationName: 'rotate',
                pseudoElement: '',
                elapsedTime: 3
            });
            expect(options.pseudoElement).to.equals('');
            expect(options.elapsedTime).to.equals(3);
            expect(options.animationName).to.equals('rotate');
        });

        it(`should default the pseudoElement to empty string, elapsedTime to 0.0 and animationName
        to empty when not given`, function() {
            let options = AnimationDriver.initEvent({}, {});

            expect(options.pseudoElement).to.equals('');
            expect(options.elapsedTime).to.equals(0.0);
            expect(options.animationName).to.equals('');
        });
    });

    describe('.create(type, eventInit?, detail?)', function() {
        it(`should create and return a native AnimationEvent object of the given type, using
        the optional eventInit options`, function() {
            let event = AnimationDriver.create('animationstart', {});
            expect(event).to.be.an('AnimationEvent');
        });
    });

    describe('#constructor(event)', function() {
        it(`should create and return a AnimationDriver for the given dispatched event`, function() {
            expect(driver).to.be.a('AnimationDriver');
        });

        it(`should inherit from Driver`, function() {
            expect(driver).to.be.instanceOf(Driver);
        });
    });

    describe('#pseudoElement', function() {
        it(`should hold the animation css pseudoElement if any`, function() {
            expect(driver.pseudoElement).to.equals('');
        });
    });

    describe('#elapsedTime', function() {
        it(`should hold the elapsed time since the animation has been active before the event
        was fired`, function() {
            expect(driver.elapsedTime).to.equals(0.0);
        });
    });

    describe('#animationName', function() {
        it(`should hold the animation name`, function() {
            expect(driver.animationName).to.equals('');
        });
    });
});