import Driver from '../../../../src/modules/Event/Drivers/Driver.js';

describe('Event.Drivers.Driver', function() {

    let target = null,
        event = null,
        driver = null;

    beforeEach(function() {
        target = document.createElement('form');
        event = Driver.create('submit', {});

        driver = new Driver(event);
    });

    describe('.events', function() {
        it('should be an array containing all events in the Event interface', function() {
            expect(Driver.events).to.be.an('Array').and.that.includes('play');
        });
    });

    describe('.initEvent(storeIn, getFrom)', function() {
        it(`should initialize the event options according to the Event interface eventInit spec
        and return the result`, function() {
            let options = Driver.initEvent({}, {bubbles: false, cancelable: false});
            expect(options.cancelable).to.be.false;
            expect(options.bubbles).to.be.false;
        });

        it(`should set the bubbles option to true, cancelable to true if no value is given`, function() {
            let options = Driver.initEvent({}, {});
            expect(options.cancelable).to.be.true;
            expect(options.bubbles).to.be.true;
        });
    });

    describe('.create(type, eventInit?)', function() {
        it(`should create and return an Event of the given type, using the optional eventInit
        options`, function() {
            let event = Driver.create('play', {});
            expect(event).to.be.an('Event');
        });

        it(`should use default eventInit options if no options are provided`, function() {
            let event = Driver.create('play', {});
            expect(event).to.be.an('Event');
        });
    });

    describe('#constructor(event)', function() {
        it(`should create and return an Driver for the given dispatched event`, function() {
            expect(driver).to.be.an('Driver');
        });
    });

    describe('#type', function() {
        it(`should hold the event type`, function() {
            expect(driver.type).to.equals('submit');
        });
    });

    describe('#target', function() {
        it(`should hold the event target`, function(done) {
            target.addEventListener('submit', function(e) {
                e.preventDefault();
                let driver = new Driver(e);
                if (driver.target === target)
                    done();
                else
                    done(new Error('incorrect event target'));
            });
            target.dispatchEvent(event);
        });
    });

    describe('#currentTarget', function() {
        it(`should return the event current target whose listener is executing if called as
        a getter`, function(done) {
            document.addEventListener('submit', function(e) {
                let driver = new Driver(e);
                e.preventDefault();
                if (driver.currentTarget === document)
                    done();
                else
                    done(new Error('incorrect event target'));
            }, false);
            document.body.appendChild(target);
            target.dispatchEvent(event);
            document.body.removeChild(target);
        });

        it(`should set the event current target when called as a setter`, function() {
            driver.currentTarget = window;
            expect(driver.currentTarget).to.equals(window);
        });

        it(`should ignore the set call if the assigned value is not a valid event target`, function() {
            driver.currentTarget = undefined;
            expect(driver.currentTarget).to.equals(null);
        });
    });

    describe('#passive', function() {
        it(`should return a boolean value that indicates if the current executing listener was
        bound in the passive mode if called as a getter`, function() {
            expect(driver.passive).to.equals(false);
        });

        it(`should set the passive state to the assigned boolean value if called as a setter`, function() {
            driver.passive = true;
            expect(driver.passive).to.equals(true);

            driver.passive = false;
            expect(driver.passive).to.equals(false);
        });
    });

    describe('#phase', function() {
        it(`should return the event current propagation phase if called as a getter`, function() {
            expect(driver.phase).to.equals(1);
        });

        it(`should set the event current propagation phase if called as a setter`, function() {
            driver.phase = 0;
            expect(driver.phase).to.equals(0);

            driver.phase = 1;
            expect(driver.phase).to.equals(1);

            driver.phase = 2;
            expect(driver.phase).to.equals(2);

            driver.phase = 3;
            expect(driver.phase).to.equals(3);
        });

        it(`should set the event current propagation phase to 3 for any assigned value that
        is neither 0, 1, nor 2`, function() {
            driver.phase = 3;
            expect(driver.phase).to.equals(3);

            driver.phase = '3';
            expect(driver.phase).to.equals(3);

            driver.phase = '';
            expect(driver.phase).to.equals(3);

            driver.phase = 5;
            expect(driver.phase).to.equals(3);
        });
    });

    describe('#bubbles', function() {
        it(`should hold a boolean value that indicates if the event bubbles`, function() {

            expect(driver.bubbles).to.be.true;
            //create a an event that does not bubble
            event = Driver.create('submit', {bubbles: false});

            driver = new Driver(event);
            expect(driver.bubbles).to.be.false;
        });
    });

    describe('#isTrusted', function() {
        it(`should hold a boolean value indicating if the event is a trusted event, that is, if
        the event was created by the user agent or created dynamically through scripting`, function() {
            expect(driver.isTrusted).to.be.false;
        });
    });

    describe('#defaultPrevented', function() {
        it(`should hold a boolean value indicating if event's default action has been prevented.`, function() {
            expect(driver.defaultPrevented).to.be.false;
            driver.preventDefault();

            expect(driver.defaultPrevented).to.be.true;
        });
    });

    describe('#isPropagating', function() {
        it(`should hold a boolean value indicating if event is propagating`, function() {
            expect(driver.isPropagating).to.be.true;
            driver.stopPropagation();

            expect(driver.isPropagating).to.be.false;
        });
    });

    describe('#timestamp', function() {
        it(`should hold a timestamp value that reflects the time that the event was created`, function() {
            expect(driver.timestamp).to.be.a('number');
        });
    });

    describe('#preventDefault()', function() {
        it(`should prevent event's default action when called`, function() {
            expect(driver.defaultPrevented).to.be.false;
            driver.preventDefault();

            expect(driver.defaultPrevented).to.be.true;
        });

        it(`should do nothing on subsequent method calls`, function() {
            expect(driver.defaultPrevented).to.be.false;
            driver.preventDefault();

            driver.preventDefault();
            driver.preventDefault();

            expect(driver.defaultPrevented).to.be.true;
        });

        it(`should throw error if called to prevent default inside a passive listener`, function() {
            driver.passive = true;
            expect(function() {
                driver.preventDefault();
            }).to.throw(Error);
        });
    });

    describe('#stopPropagation()', function() {
        it(`should prevent the event from propagating up the phase line`, function() {
            expect(driver.isPropagating).to.be.true;
            driver.stopPropagation();

            expect(driver.isPropagating).to.be.false;
        });
    });
});