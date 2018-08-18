import _Event from '../../src/modules/Event.js';

describe('Event module', function() {
    let testDiv = null,
        testImage = null,
        testInput = null;

    before(function() {
        testDiv = document.createElement('div');
        testDiv.innerHTML = `
            <input type="text" name="txt-test-input" value="" />
            <img src="" alt="test image" />
        `;

        document.body.appendChild(testDiv);
        testInput = testDiv.firstElementChild;
        testImage = testInput.nextElementSibling;
    });

    after(function() {
        document.body.removeChild(testDiv);
    });

    describe('.install(hostParam, rootParam)', function() {
        it('should call the global install method with the given parameter', function() {
            expect(_Event.install(window, document)).to.be.false;
        });
    });

    describe('.silenceEvents', function() {
        it (`should set or return the silence event current status when called as a setter
        or a getter. The silenceEvents status determines if the module will stop the browser
        from further processing of the event. This is the default behaviour but may make event
        handlers bound outside of the library such as through vanilla js or other js library not to
        get triggered at all. Set this to false if use other means to bind event listeners.`, function(done) {
            expect(_Event.silenceEvents).to.be.true;

            _Event.silenceEvents = false;

            let handler = function() {
                _Event.silenceEvents = true;
                window.removeEventListener('click', handler, false);
                done();
            };

            _Event.bind('click', function() {}, window, {runOnce: true});
            window.addEventListener('click', handler, false);

            _Event.dispatch('click', window);
        });
    });

    describe('.scrollEventThrottleInterval', function() {
        it(`should return the scroll event throttle interval in milliseconds if called as a
        getter`, function() {
            expect(_Event.scrollEventThrottleInterval).to.equals(100);
        });

        it(`should set the scroll event throttle interval in milliseconds if called as a
        setter`, function() {
            _Event.scrollEventThrottleInterval = 250;
            expect(_Event.scrollEventThrottleInterval).to.equals(250);
        });

        it(`should do nothing if the assigned value is not a number`, function() {
            _Event.scrollEventThrottleInterval = '300';
            expect(_Event.scrollEventThrottleInterval).to.equals(250);
        });
    });

    describe('scroll event throttling', function() {
        it (`should throttle scroll event execution`, function() {
            _Event.scrollEventThrottleInterval = 100;

            let startTime = Date.now(),
                endTime = null;

            _Event.bind('scroll', function() {
                endTime = Date.now();
            }, window);

            _Event.dispatch('scroll', window); //dispatch first scroll event

            endTime = null;
            while (endTime === null)
                _Event.dispatch('scroll', window);

            expect(endTime - startTime).to.be.at.least(100);

            _Event.unbindAll('scroll', window);
        });
    });

    describe('.resizeEventThrottleInterval', function() {
        it(`should return the resize event throttle interval in milliseconds if called as a
        getter`, function() {
            expect(_Event.resizeEventThrottleInterval).to.equals(100);
        });

        it(`should set the resize event throttle interval in milliseconds if called as a
        setter`, function() {
            _Event.resizeEventThrottleInterval = 250;
            expect(_Event.resizeEventThrottleInterval).to.equals(250);
        });

        it(`should do nothing if the assigned value is not a number`, function() {
            _Event.resizeEventThrottleInterval = '300';
            expect(_Event.resizeEventThrottleInterval).to.equals(250);
        });
    });

    describe('resize event throttling', function() {
        it (`should throttle resize event execution`, function() {
            _Event.resizeEventThrottleInterval = 100;

            let startTime = Date.now(),
                endTime = null;

            _Event.bind('resize', function() {
                endTime = Date.now();
            }, window);

            _Event.dispatch('resize', window); //dispatch first resize event

            endTime = null;
            while (endTime === null)
                _Event.dispatch('resize', window);

            expect(endTime - startTime).to.be.at.least(100);

            _Event.unbindAll('resize', window);
        });
    });

    describe('.ready(callback, config?, scope?, ...parameters?)', function() {
        it(`should bind a ready event listener callback that gets executed once the
            DOMContentLoaded event is fired`, function(done) {

            let callback = function() {
                done();
            };

            _Event.ready(callback)

                .dispatch('DOMContentLoaded', document);
        });

        it(`should pass in an event object to the callback method during execution`, function(done) {
            let callback = function(e) {
                if (e && e.type === 'DOMContentLoaded')
                    done();
                else
                    done(new Error('wrong event object passed in'));
            };

            _Event.ready(callback)

                .dispatch('DOMContentLoaded', document);
        });

        it('should throw TypeError if argument one is not a function', function() {
            expect(function() {
                _Event.ready(null);
            }).to.throw(TypeError);
        });

        it(`should take an optional config.priority integer value as a second argument. The
            priority value should alter the callback's execution order in the presence of multiple bound listeners.
            Default value should be 5 if not defined. The lower the value, the more prioritized it should be`, function() {

            let signatures = [];

            let firstListener = function() {
                    signatures.push('first');
                },

                secondListener = function() {
                    signatures.push('second');
                },

                thirdListener = function() {
                    signatures.push('third');
                };

            _Event.ready(firstListener, {
                priority: 9 // gets executed last after callback with default priority of 5
            })

                .ready(secondListener) //default priority of 5 is assigned. gets executed after
            //callback with priority of 1

                .ready(thirdListener, {
                    priority: 1 //gets executed first.
                })

                .dispatch('DOMContentLoaded', document);

            expect(signatures).to.be.lengthOf(3).and.to.deep.equals(['third', 'second', 'first']);
        });

        it(`should also take an optional config.runLast? boolean value as a second argument. If set
        to true, the listener should be executed last among a list of bound listeners. The priority
        value should become relevant if there are one or more listeners with runLast flag set to true.
        Default value should be false if not defined`, function() {

            let signatures = [];

            let firstListener = function() {
                    signatures.push('first');
                },

                secondListener = function() {
                    signatures.push('second');
                },

                thirdListener = function() {
                    signatures.push('third');
                };

            _Event.ready(firstListener, {
                priority: 1,
                runLast: true // gets executed just before the secondListener, because of the
                //priority difference though both are configured to run last.
            })

                .ready(secondListener, {
                    runLast: true //gets executed last. it priority is defaulted to 5
                })

                .ready(thirdListener, {
                    priority: 10 //gets executed first. despite having the least priority.
                //This is because other listeners have been configured to run last.
                })

                .dispatch('DOMContentLoaded', document);

            expect(signatures).to.be.lengthOf(3).and.to.deep.equals(['third', 'first', 'second']);
        });

        it(`should also take an optional config.runFirst? boolean value as a second argument. If set
        to true, the listener should be executed first among a list of bound listeners. The priority
        value should become relevant if there are one or more listeners with runFirst flag set to true.
        Default value should be false if not defined`, function() {

            let signatures = [];

            let firstListener = function() {
                    signatures.push('first');
                },

                secondListener = function() {
                    signatures.push('second');
                },

                thirdListener = function() {
                    signatures.push('third');
                };

            _Event.ready(firstListener) // priority defaults to 5. gets executed last

                .ready(secondListener, {
                    priority: 3 //gets executed immediately after the thirdListener.
                })

                .ready(thirdListener, {
                    priority: 10,
                    runFirst: true //gets executed first due to the runFirst config despite having
                //the least prioriy
                })

                .dispatch('DOMContentLoaded', document);

            expect(signatures).to.be.lengthOf(3).and.to.deep.equals(['third', 'second', 'first']);
        });

        it(`should take an optional execution scope object as third argument`, function() {
            let isAccurateScope = false,
                scope = {id: 'testing scope'};

            let callback = function() {
                if (this === scope)
                    isAccurateScope = true;
            };

            _Event.ready(callback, null, scope)

                .dispatch('DOMContentLoaded', document);

            expect(isAccurateScope).to.be.true;
        });

        it(`should take optional comma separated list of parameters and pass to callback listener`, function() {
            let list = [];

            let callback = function(event, param1, param2, param3) {
                list.push(param1, param2, param3);
            };

            _Event.ready(callback, null, null, 1, 2, 3)

                .dispatch('DOMContentLoaded', document);

            expect(list).to.be.lengthOf(3).and.to.deep.equals([1, 2, 3]);
        });
    });

    describe('.bind(type, callback, target, config?, scope?, ...parameters?)', function() {
        it(`should bind an event listener callback for the given event type(s) on the given
            event target`, function(done) {

            let callback = function() {
                done();
            };

            _Event.bind('click', callback, testDiv, {
                runOnce: true
            })

                .dispatch('click', testDiv);
        });

        it (`should not bind the same event listener callback two times on an event target for a
        given event type when both have the same passive and capture configuration flags.`, function() {
            let callCount = 0,

                callback = function() {
                    callCount += 1;
                };

            _Event.bind('click', callback, testDiv, {
                runOnce: true
            })

                .bind('click', callback, testDiv) //won't succeed

                .dispatch('click', testDiv);

            expect(callCount).to.equals(1);
        });

        it(`should pass in an event object to the callback method during execution`, function(done) {
            let callback = function(e) {
                if (e && e.type === 'click')
                    done();
                else
                    done(new Error('wrong event object passed in'));
            };

            _Event.bind('click', callback, testDiv, {runOnce: true})
                .dispatch('click', testDiv);
        });

        it(`should stop event propagation once the stopPropagation() method is called on the event object`, function() {
            let callCount = 0;

            let topCallback = function() {
                    callCount += 1;
                },

                callback = function(e) {
                    callCount += 1;
                    e.stopPropagation();
                };

            _Event.bind('click', topCallback, document.body)

                .bind('click', callback, testDiv)

                .dispatch('click', testDiv)

                .unbind('click', topCallback, document.body)

                .unbind('click', callback, testDiv);

            expect(callCount).to.equals(1);
        });

        it('should throw TypeError if callback is not a function', function() {
            expect(function() {
                _Event.bind('click', null);
            })
                .to.throw(TypeError);
        });

        it('should throw TypeError if target is not an eventTarget', function() {
            expect(function() {
                _Event.bind('click', function() {}, null);
            })
                .to.throw(TypeError);
        });

        it(`should sort listeners according to their node order by default, from target to its parent
        hierrachy up to document and finally to window object`, function() {
            let signatures = [];

            _Event.bind('click', () => {
                signatures.push('window');
            }, window, {runOnce: true})

                .bind('click', () => {
                    signatures.push('body');
                }, document.body, {runOnce: true})

                .bind('click', () => {
                    signatures.push('document');
                }, document, {runOnce: true})

                .bind('click', () => {
                    signatures.push('div');
                }, testDiv, {runOnce: true})

                .dispatch('click', testDiv);

            expect(signatures).to.deep.equals(['div', 'body', 'document', 'window']);
        });

        it(`should take an optional config.priority integer value as a fourth argument. The
        priority value should alter the callback's execution order in the presence of multiple bound listeners.
        Default value should be 5 if not defined. The lower the value, the more prioritized it should be`, function() {

            let signatures = [];

            let firstListener = function() {
                    signatures.push('first');
                },

                secondListener = function() {
                    signatures.push('second');
                },

                thirdListener = function() {
                    signatures.push('third');
                };

            _Event.bind('load', firstListener, testImage, {
                priority: 9 // gets executed last after callback with default priority of 5
            })

                .bind('load', secondListener, testImage) //default priority of 5 is assigned.

                .bind('load', thirdListener, testImage, {
                    priority: 1 //gets executed first.
                })

                .dispatch('load', testImage)

                .unbindAll('load', testImage); //unbind  all the load event listeners

            expect(signatures).to.be.lengthOf(3)
                .and.to.deep.equals(['third', 'second', 'first']);
        });

        it(`should also take an optional config.runLast? boolean value as a fourth argument. If set
        to true, the listener should be executed last among a list of bound listeners. The priority
        value should become relevant if there are one or more listeners with runLast flag set to true.
        Default value should be false if not defined`, function() {

            let signatures = [];

            let firstListener = function() {
                    signatures.push('first');
                },

                secondListener = function() {
                    signatures.push('second');
                },

                thirdListener = function() {
                    signatures.push('third');
                };

            _Event.bind('focus', firstListener, testDiv, {
                priority: 1,
                runLast: true // gets executed just before the secondListener, because of the
                //priority difference though both are configured to run last.
            })

                .bind('focus', secondListener, testDiv, {
                    runLast: true //gets executed last. it priority is defaulted to 5
                })

                .bind('focus', thirdListener, testDiv, {
                    priority: 10 //gets executed first. despite having the least priority.
                //This is because other listeners have been configured to run last.
                })

                .dispatch('focus', testDiv)

                .unbindAll('focus', testDiv); //unbind all the focus event listeners

            expect(signatures).to.be.lengthOf(3).and
                .to.deep.equals(['third', 'first', 'second']);
        });

        it(`should also take an optional config.runFirst? boolean value as a fourth argument. If set
        to true, the listener should be executed first among a list of bound listeners. The priority
        value should become relevant if there are one or more listeners with runFirst flag set to true.
        Default value should be false if not defined`, function() {

            let signatures = [];

            let firstListener = function() {
                    signatures.push('first');
                },

                secondListener = function() {
                    signatures.push('second');
                },

                thirdListener = function() {
                    signatures.push('third');
                };

            _Event.bind('keydown', firstListener, testInput) // priority defaults to 5. gets executed last

                .bind('keydown', secondListener, testInput, {
                    priority: 3 //gets executed immediately after the thirdListener.
                })

                .bind('keydown', thirdListener, testInput, {
                    priority: 10,
                    runFirst: true //gets executed first due to the runFirst config despite having
                //the least prioriy
                })

                .dispatch('keydown', testInput)

                .unbindAll('keydown', testInput); //unbind all the keydown event listeners

            expect(signatures).to.be.lengthOf(3).and
                .to.deep.equals(['third', 'second', 'first']);
        });

        it(`should take an optional config.runOnce? boolean value as a fourth argument. If set to
        true, the callback listener should get executed only once and gets removed/unbound.
        Default value should be false if not defined`, function() {

            let callCount = 0;

            let listener = function() {
                callCount += 1;
            };

            _Event.bind('click', listener, testDiv, {
                runOnce: true //run the listener once and unbind it
            })

                .dispatch('click', testDiv)

                .dispatch('click', testDiv); //trigger clicks twice

            expect(callCount).to.equals(1);
        });

        it(`should take an optional config.capture? boolean value as a fourth argument. If set
        to true, the listener should be bound on the capturing phase. Default value should be
        false`, function() {

            let correctPhaseCount = 0;
            let callback = function(e) {
                if (e && e.phase === 1)
                    correctPhaseCount += 1;

                if (correctPhaseCount === 2)
                    e.stopPropagation();
            };

            _Event.bind('click', callback, document.body, {
                runOnce: true,
                capture: true
            })

                .bind('click', callback, document, {
                    runOnce: true,
                    capture: true
                })

                //should not work
                .bind('click', callback, testDiv, {
                    runOnce: true,
                    capture: true
                })

                .dispatch('click', testDiv);

            expect(correctPhaseCount).to.equals(2);

            _Event.unbind('click', callback, testDiv, {capture: true});
        });

        it(`should take an optional config.acceptBubbledEvents? boolean value as a fourth
        argument. If set to false, the listener should only be triggered by events that originated
        from the target; Events in the bubbling phase should not trigger its execution. Default value should be
        true`, function() {
            let callCount = 0,

                callback = function() {
                    callCount += 1;
                };

            _Event.bind('click', callback, document.body, {
                acceptBubbledEvents: false
            })

                .dispatch('click', testDiv) // this event should not trigger the callback

                .dispatch('click', document.body) // this event should trigger the callback

                .unbind('click', callback, document.body);

            expect(callCount).to.equals(1);
        });

        it(`should take an optional config.passive? boolean value as a fourth argument. If set
        to true, the listener should not call preventDefault() on the event object as doing so
        should throw error. Default value should be false`, function() {
            let errorThrown = false;

            let callback = function(e) {
                try {
                    e.preventDefault();
                }
                catch(ex) {
                    errorThrown = true;
                }
            };

            _Event.bind('touchstart', callback, testDiv, {
                passive: true,
                runOnce: true
            })

                .dispatch('touchstart', testDiv);

            expect(errorThrown).to.be.true;
        });

        it(`should take an optional execution scope object as fifth argument`, function() {
            let isAccurateScope = false,
                scope = {id: 'testing scope'};

            let callback = function() {
                if (this === scope)
                    isAccurateScope = true;
            };

            _Event.bind('copy', callback, document, {
                runOnce: true
            }, scope)

                .dispatch('copy', document);

            expect(isAccurateScope).to.be.true;
        });

        it(`should take an optional comma separated list of parameters and pass to callback listener`, function() {
            let list = [];

            let callback = function(e, param1, param2, param3) {
                list.push(param1, param2, param3);
            };

            _Event.bind('hashchange', callback, window, {
                runOnce: true,
            }, null, 1, 2, 3)

                .dispatch('hashchange', document); //trigger on document, it will bubble to window

            expect(list).to.be.lengthOf(3).and.to.deep.equals([1, 2, 3]);
        });
    });

    describe('.on(type, callback, target, config?, scope?, ...parameters?)', function() {
        it(`should bind an event listener callback for the given event type(s) on the given
            event target. It is an aliase for the bind method`, function(done) {

            let callback = function() {
                done();
            };

            _Event.on('click', callback, testDiv, {
                runOnce: true
            })

                .dispatch('click', testDiv);
        });
    });

    describe('.once(type, callback, target, config?, scope?, ...parameters?)', function() {
        it(`should bind a run once event listener callback for the given event type(s) on the given
            event target`, function() {

            let callCount = 0;

            _Event.once('click', function() {
                callCount += 1;
            }, testDiv)

                .once('click', function() {
                    callCount += 1;
                }, testDiv, {priority: 3})

                .dispatch('click', testDiv)

                .dispatch('click', testDiv);

            expect(callCount).to.equals(2);
        });
    });

    describe('.unbind(type, callback, target, config?)', function() {
        it(`should unbind an event listener callback for the given event type(s) on the given
            event target that was bound in the same passed in config phase and passive state.
            e.g listener bound on bubble phase and non passive`, function() {
            let callCount = 0;
            let callback = function() {
                callCount += 1;
            };

            _Event.bind('click', callback, testDiv);
            _Event.dispatch('click', testDiv);

            _Event.unbind('click', callback, testDiv);
            _Event.dispatch('click', testDiv);

            expect(callCount).to.equals(1);
        });

        it(`should unbind an event listener callback for the given event type(s) on the given
            event target that was bound in the same passed in config phase and passive state.
            e.g listener bound on bubble phase and passive`, function() {
            let callCount = 0;
            let callback = function() {
                    callCount += 1;
                },
                config = {passive: true};

            _Event.bind('click', callback, testDiv, config);
            _Event.dispatch('click', testDiv);

            _Event.unbind('click', callback, testDiv, config);
            _Event.dispatch('click', testDiv);

            expect(callCount).to.equals(1);
        });

        it(`should unbind an event listener callback for the given event type(s) on the given
            event target that was bound in the same passed in config phase and passive state.
            e.g listener bound on capture phase and non passive`, function() {
            let callCount = 0;
            let callback = function() {
                    callCount += 1;
                },
                config = {capture: true};

            _Event.bind('click', callback, document.body, config);
            _Event.dispatch('click', testDiv);

            _Event.unbind('click', callback, document.body, config);
            _Event.dispatch('click', testDiv);

            expect(callCount).to.equals(1);
        });

        it(`should unbind an event listener callback for the given event type(s) on the given
            event target that was bound in the same passed in config phase and passive state.
            e.g listener bound on capture phase and passive`, function() {
            let callCount = 0;
            let callback = function() {
                    callCount += 1;
                },
                config = {capture: true, passive: true};

            _Event.bind('click', callback, document.body, config);
            _Event.dispatch('click', testDiv);

            _Event.unbind('click', callback, document.body, config);
            _Event.dispatch('click', testDiv);

            expect(callCount).to.equals(1);
        });

        it('should throw TypeError if callback is not a function', function() {
            expect(function() {
                _Event.unbind('click', null);
            }).to.throw(TypeError);
        });

        it('should throw TypeError if target is not an eventTarget', function() {
            expect(function() {
                _Event.unbind('click', function() {}, null);
            }).to.throw(TypeError);
        });

        it(`when unbinding capturing events, and or passive events, the same flag must be supplied
        to the unbind method just like when binding`, function() {
            let called = false;
            let callback = function() {
                called = true;
            };

            _Event.bind('touchstart', callback, testDiv, {
                passive: true
            })
                .dispatch('touchstart', testDiv);

            expect(called).to.be.true;

            //try unbinding the listener without specifying the passive flag as true
            called = false;
            _Event.unbind('touchstart', callback, testDiv).dispatch('touchstart', testDiv);

            expect(called).to.be.true; // shows that it was not removed

            //now try unbinding the listener by specifying the passive flag as true
            called = false;
            _Event.unbind('touchstart', callback, testDiv, {
                passive: true
            }).dispatch('touchstart', testDiv);

            expect(called).to.be.false; // shows that it was removed
        });
    });

    describe('.off(type, callback, target, config?)', function() {
        it(`should unbind an event listener callback for the given event type(s) on the given
            event target that was bound in the same passed in config phase and passive state.
            It is an aliase for the bind method`, function() {
            let callCount = 0;
            let callback = function() {
                callCount += 1;
            };

            _Event.on('click', callback, testDiv)
                .dispatch('click', testDiv)

                .off('click', callback, testDiv)
                .dispatch('click', testDiv);

            expect(callCount).to.equals(1);
        });
    });

    describe('.unbindAll(type, target, config?)', function() {
        it(`should unbind all event listeners for the given event type(s) on the given
            event target that are running in the same phase and passive state.
            e.g events running in bubble phase, non passive`, function() {

            let callCount = 0;

            let listener1 = function() {
                    callCount += 1;
                },
                listener2 = function() {
                    callCount += 1;
                };

            _Event.bind('click', listener1, testDiv)

                .bind('click', listener2, testDiv)

                .dispatch('click', testDiv);

            expect(callCount).to.equals(2);

            _Event.unbindAll('click', testDiv)

                .dispatch('click', testDiv);

            expect(callCount).to.equals(2);
        });

        it(`should unbind all event listeners for the given event type(s) on the given
            event target that are running in the same phase and passive state.
            e.g events running in bubble phase, passive`, function() {

            let callCount = 0,
                config = {passive: true};

            let listener1 = function() {
                    callCount += 1;
                },
                listener2 = function() {
                    callCount += 1;
                };

            _Event.bind('click', listener1, testDiv, config)

                .bind('click', listener2, testDiv, config)

                .dispatch('click', testDiv);

            expect(callCount).to.equals(2);

            _Event.unbindAll('click', testDiv, config)

                .dispatch('click', testDiv);

            expect(callCount).to.equals(2);
        });

        it(`should unbind all event listeners for the given event type(s) on the given
            event target that are running in the same phase and passive state.
            e.g events running in capture phase, non passive`, function() {

            let callCount = 0,
                config = {capture: true};

            let listener1 = function() {
                    callCount += 1;
                },
                listener2 = function() {
                    callCount += 1;
                };

            _Event.bind('click', listener1, document.body, config)

                .bind('click', listener2, document.body, config)

                .dispatch('click', testDiv);

            expect(callCount).to.equals(2);

            _Event.unbindAll('click', document.body, config)

                .dispatch('click', testDiv);

            expect(callCount).to.equals(2);
        });

        it(`should unbind all event listeners for the given event type(s) on the given
            event target that are running in the same phase and passive state.
            e.g events running in capture phase, passive`, function() {

            let callCount = 0,
                config = {capture: true, passive: true};

            let listener1 = function() {
                    callCount += 1;
                },
                listener2 = function() {
                    callCount += 1;
                };

            _Event.bind('click', listener1, document.body, config)

                .bind('click', listener2, document.body, config)

                .dispatch('click', testDiv);

            expect(callCount).to.equals(2);

            _Event.unbindAll('click', document.body, config)

                .dispatch('click', testDiv);

            expect(callCount).to.equals(2);
        });

        it('should throw TypeError if target is not an eventTarget', function() {
            expect(function() {
                _Event.unbindAll('click', null);
            }).to.throw(TypeError);
        });

        it(`when unbinding capturing events, and or passive events, the same flag must be supplied
        to the unbindAll method just like when binding`, function() {
            let called = false;

            let callback = function() {
                called = true;
            };

            _Event.bind('touchstart', callback, testDiv, {
                passive: true
            })

                .dispatch('touchstart', testDiv);

            expect(called).to.be.true;

            //try unbinding the listener without specifying the passive flag as true
            called = false;
            _Event.unbindAll('touchstart', testDiv)

                .dispatch('touchstart', testDiv);

            expect(called).to.be.true; // shows that it was not removed

            //now try unbinding the listener by specifying the passive flag as true
            called = false;
            _Event.unbindAll('touchstart', testDiv, {
                passive: true
            })

                .dispatch('touchstart', testDiv);

            expect(called).to.be.false; // shows that it was removed
        });
    });

    describe('.offAll(type, target, config?)', function() {
        it(`should unbind all event listeners for the given event type(s) on the given
            event target that are running in the same phase and passive state. It is an aliase
            for the unbindAll method`, function() {

            let callCount = 0;

            let listener1 = function() {
                    callCount += 1;
                },
                listener2 = function() {
                    callCount += 1;
                };

            _Event.on('click', listener1, testDiv)

                .on('click', listener2, testDiv)

                .dispatch('click', testDiv);

            expect(callCount).to.equals(2);

            _Event.offAll('click', testDiv)

                .dispatch('click', testDiv);

            expect(callCount).to.equals(2);
        });
    });

    describe('.dispatch(type, target, eventInit?, detail?)', function() {
        it(`should create and dispatch the given event types on the given target`, function(done) {
            let callback = function(e) {
                if (e.type === 'click')
                    done();
                else
                    done(new Error('wrong event dispatched'));
            };
            _Event.bind('click', callback, testDiv, {
                runOnce: true
            })

                .dispatch('click', testDiv);
        });

        it('should throw TypeError if target is not an eventTarget', function() {
            expect(function() {
                _Event.dispatch('click', null);
            }).to.throw(TypeError);
        });

        it(`should take an optional event initialization object that sets up the event properties
        and behaviour such as if it should bubble`, function() {
            let called = false;
            let callback = function() {
                called = true;
            };

            //bind event listener on the document body
            _Event.bind('click', callback, document.body);

            //dispatch a click event that does not bubble on the testDiv element
            _Event.dispatch('click', testDiv, {
                bubbles: false
            });
            expect(called).to.be.false;

            //now dispatch a click event that bubbles on the testDiv element once again
            _Event.dispatch('click', testDiv);
            _Event.unbind('click', callback, document.body);

            expect(called).to.be.true;
        });

        it(`should take an optional event detail object as fourth parameter when dispatching
        custom events. The detail object is the custom event data that is accessed using the
        detail property on the event object`, function(done) {
            let bio = {name: 'Alexandre', age: 25, height: '5ft', location: 'Sao Tome'};
            let callback = function(e) {
                if (e.detail === bio)
                    done();
                else
                    done(new Error('incorrect custom event data found'));
            };

            //bind event listener on the document body
            _Event.bind('update-bio', callback, document, {
                runOnce: true
            })

                .dispatch('update-bio', document, {bubbles: false}, bio);
        });
    });
});