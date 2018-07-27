import Util from '../../src/modules/Util.js';

describe('Util module', function() {
    describe('.install(hostParam, rootParam)', function() {
        it('should call the global install method with the given parameter', function() {
            expect(Util.install(window, document)).to.be.false;
        });
    });

    describe('.uninstall()', function() {
        it('should call the global uninstall method', function() {
            expect(Util.uninstall()).to.be.true;
            expect(Util.install(window, document)).to.be.true;
        });
    });

    describe('.isNumber(variable)', function() {
        it('should return true if argument is a number', function() {
            expect(Util.isNumber(3.2)).to.be.true;
            expect(Util.isNumber(-3.2)).to.be.true;
            expect(Util.isNumber(0)).to.be.true;
        });

        it('should return false if argument is not a number', function() {
            expect(Util.isNumber('3.2')).to.be.false;
            expect(Util.isNumber([1])).to.be.false;
            expect(Util.isNumber(NaN)).to.be.false;
        });
    });

    describe('.isCallable(variable)', function() {
        it('should return true if argument is a function', function() {
            expect(Util.isCallable(name => name)).to.be.true;
        });

        it('should return false if argument is not a function', function() {
            expect(Util.isCallable(new RegExp('a'))).to.be.false;
        });
    });

    describe('.isArray(variable)', function() {
        it('should return true if argument is an array', function() {
            expect(Util.isArray([])).to.be.true;
        });

        it('should return false if argument is not an array', function() {
            expect(Util.isArray({})).to.be.false;
            expect(Util.isArray('')).to.be.false;
        });
    });

    describe('.isObject(variable)', function() {
        it('should return true if argument is an object', function() {
            expect(Util.isObject({})).to.be.true;
            expect(Util.isObject([])).to.be.true;
        });

        it('should return false if argument is not an object', function() {
            expect(Util.isObject('')).to.be.false;
            expect(Util.isObject(null)).to.be.false;
            expect(Util.isObject(undefined)).to.be.false;
        });
    });

    describe('.objectIsA(objectArg, name)', function() {
        it('should return true if object is a given name kind', function() {
            expect(Util.objectIsA([], 'Array')).to.be.true;
            expect(Util.objectIsA({}, 'Object')).to.be.true;
        });

        it('should return false if argument is neither an object nor an object of the given kind', function() {
            expect(Util.objectIsA(null, 'Object')).to.be.false;
            expect(Util.objectIsA({}, 'Array')).to.be.false;
        });
    });

    describe('.isPlainObject(variable)', function() {
        it('should return true if argument is a plain object', function() {
            expect(Util.isPlainObject({})).to.be.true;
            expect(Util.isPlainObject(Object.create(null))).to.be.true;
        });

        it('should return false if argument is not a plain object', function() {
            expect(Util.isPlainObject([])).to.be.false;
            expect(Util.isPlainObject(this)).to.be.false;
        });
    });

    describe('.isDocumentNode(node)', function() {
        it('should return true if argument is a document node', function() {
            expect(Util.isDocumentNode(document)).to.be.true;
        });

        it('should return false if argument is not a document node', function() {
            expect(Util.isDocumentNode(document.documentElement)).to.be.false;
            expect(Util.isDocumentNode(document.createDocumentFragment())).to.be.false;
            expect(Util.isDocumentNode(null)).to.be.false;
        });
    });

    describe('.isElementNode(node)', function() {
        it('should return true if argument is an element node', function() {
            expect(Util.isElementNode(document.body)).to.be.true;
        });

        it('should return false if argument is not an element node', function() {
            expect(Util.isElementNode(document)).to.be.false;
            expect(Util.isElementNode(null)).to.be.false;
        });
    });

    describe('.isAttributeNode(node)', function() {

        it('should return true if argument is an attribute node', function() {
            let attr = document.createAttribute('id');
            expect(Util.isAttributeNode(attr)).to.be.true;
        });

        it('should return false if argument is not an attribute node', function() {
            expect(Util.isAttributeNode(document)).to.be.false;
            expect(Util.isAttributeNode(null)).to.be.false;
        });
    });

    describe('.isTextNode(node)', function() {

        it('should return true if argument is a text node', function() {
            let textNode = document.createTextNode('come here');
            expect(Util.isTextNode(textNode)).to.be.true;
        });

        it('should return false if argument is not a text node', function() {
            expect(Util.isTextNode(document)).to.be.false;
            expect(Util.isTextNode(null)).to.be.false;
        });
    });

    describe('.isDomFragmentNode(node)', function() {

        it('should return true if argument is a dom fragment node', function() {
            let domFragment = document.createDocumentFragment();
            expect(Util.isDOMFragmentNode(domFragment)).to.be.true;
        });

        it('should return false if argument is not a dom fragment node', function() {
            expect(Util.isDOMFragmentNode(document)).to.be.false;
            expect(Util.isDOMFragmentNode(null)).to.be.false;
        });
    });

    describe('.isCommentNode(node)', function() {

        it('should return true if argument is a comment node', function() {
            let doc = (new window.DOMParser()).parseFromString('<root></root>',  'application/xml');
            let comment = doc.createComment('This is a not-so-secret comment in your document');
            expect(Util.isCommentNode(comment)).to.be.true;
        });

        it('should return false if argument is not a dom comment node', function() {
            expect(Util.isCommentNode(document)).to.be.false;
            expect(Util.isCommentNode(null)).to.be.false;
        });
    });

    describe('.isProcessingInstructionNode(node)', function() {

        it('should return true if argument is a processing instruction node', function() {
            let doc = (new window.DOMParser()).parseFromString('<root></root>',  'application/xml');
            let processingInstruction = doc.createProcessingInstruction('xml-stylesheet', 'href="mycss.css" type="text/css"');
            expect(Util.isProcessingInstructionNode(processingInstruction)).to.be.true;
        });

        it('should return false if argument is not a processing instruction node', function() {
            expect(Util.isProcessingInstructionNode(document)).to.be.false;
            expect(Util.isProcessingInstructionNode(null)).to.be.false;
        });
    });

    describe('.isDocTypeNode(node)', function() {

        it('should return true if argument is a document type node', function() {
            let doctype = document.implementation.createDocumentType('svg:svg', '', '');
            expect(Util.isDocTypeNode(doctype)).to.be.true;
        });

        it('should return false if argument is not a document type node', function() {
            expect(Util.isDocTypeNode(document)).to.be.false;
            expect(Util.isDocTypeNode(null)).to.be.false;
        });
    });

    describe('.isEventTarget(target)', function() {
        it('should return true if argument is an event target', function() {
            expect(Util.isEventTarget(window)).to.be.true;
            expect(Util.isEventTarget(document)).to.be.true;
        });
        it('should return false if argument is not an event target', function() {
            expect(Util.isEventTarget(null)).to.be.false;
            expect(Util.isEventTarget({})).to.be.false;
        });
    });

    describe('.isValidParameter(variable, excludeNulls?)', function() {
        it('should return true if argument is a valid function parameter. a valid function parameter is a parameter that is defined', function() {
            expect(Util.isValidParameter(3.2)).to.be.true;
        });

        it('should return false if argument is not a valid function parameter. a valid function parameter is a parameter that is defined', function() {
            expect(Util.isValidParameter(undefined)).to.be.false;
        });

        it('should accept a second boolean argument indicating if null arguments should be taken as invalid', function() {
            expect(Util.isValidParameter(null, true)).to.be.false;
        });
    });

    describe('.encodeComponent(name, value)', function() {
        it ('should encode the name and value pairs and return it', function() {
            expect(Util.encodeComponent('my name', 'Harrison')).to.equals('my%20name=Harrison');
        });

        it ('should return empty string if the name part is not a string', function() {
            expect(Util.encodeComponent(2, 'Harrison')).to.equals('');
        });

        it ('should return empty string if the name part when trimmed becomes empty string', function() {
            expect(Util.encodeComponent('  ', 'Harrison')).to.equals('');
        });
    });

    describe('.encodeComponents(entries)', function() {
        it ('should encode object of name and value pairs and return it', function() {
            expect(Util.encodeComponents({name: 'Harrison', age: 22})).to.equals('name=Harrison&age=22');
        });

        it ('should return empty string object is empty', function() {
            expect(Util.encodeComponents({})).to.equals('');
        });

        it ('should only include pairs with non empty string names', function() {
            expect(Util.encodeComponents({name: 'Harrison', age: 22, '   ': 'invalid name'})).to.equals('name=Harrison&age=22');
        });
    });

    describe('.makeArray(arg, excludeNulls?)', function() {
        it('should create and return an array using the supplied argument', function() {
            expect(Util.makeArray(2)).to.deep.equals([2]);
        });

        it('should return the argument if it is already an array', function() {
            let arg = [];
            expect(Util.makeArray(arg)).to.equals(arg);
        });

        it('should return empty array if argument is not a valid parameter. i.e, if argument is undefined', function() {
            expect(Util.makeArray(undefined)).to.deep.equals([]);
        });
    });

    describe('.generateCallback(callback, scope?, parameters?)', function() {
        it('should throw error if argument one is not a function', function() {
            expect(function() {
                Util.generateCallback(null);
            }).to.throw('argument one is not a function');
        });

        it('should return a callback function', function() {
            expect(Util.generateCallback(function() {})).to.be.a('function');
        });

        it('should accept an optional execution scope object as a second argument', function() {
            let scope = {name: 'ForensicJS'},
                result = Util.generateCallback(function() {
                    return this.name;
                }, scope)();
            expect(result).to.equals('ForensicJS');
        });

        it('should accept an optional parameter or array of parameters to pass in to executable during execution as a third argument', function() {
            let parameters = ['1.0.0', 'ForensicJS'],
                result = Util.generateCallback(function(version, name) {
                    return {version, name};
                }, null, parameters)();
            expect(result.version).to.equals('1.0.0');
        });
    });

    describe('.runSafe(executable, scope?, parameters?, runAfter?)', function() {
        it('should run the callback function safely by surpressing any runtime error', function() {
            expect(function() {
                Util.runSafe(function() {
                    throw new Error('this error should be surpressed');
                });
            }).to.not.throw();
        });

        it('should throw error if argument one is not a function', function() {
            expect(function() {
                Util.runSafe(null);
            }).to.throw('argument one is not a function');
        });

        it('should accept an optional execution scope object as a second argument', function() {
            let scope = {
                    name: 'ForensicJS'
                },
                result = Util.runSafe(function() {
                    return this.name;
                }, scope);
            expect(result).to.equals('ForensicJS');
        });

        it('should accept an optional parameter or array of parameters to pass in to executable during execution as a third argument', function() {
            let parameters = ['1.0.0', 'ForensicJS'],
                result = Util.runSafe(function(version, name) {
                    return {version, name};
                }, null, parameters);
            expect(result.version).to.equals('1.0.0');
        });

        it('should accept an optional wait before execution parameter in milliseconds as a fourth parameter', function() {
            let startTime = Date.now();

            return Util.runSafe(() => Date.now() - startTime, null, null, 1000)
                .then(result => expect(result).to.be.at.least(999));
        });

        it('should return a promise if given a wait parameter as fourth argument', function() {
            expect(Util.runSafe(function() {}, null, null, 1000)).to.be.a('promise');
        });
    });

    describe('.runSafeWithDefaultArg(executable, defaultArg?, scope?, parameters?, runAfter?)', function() {
        it('should run safely the callback function with the given default argument by surpressing any runtime error', function() {
            expect(function() {
                Util.runSafeWithDefaultArg(function() {
                    throw new Error('this error should be surpressed');
                }, 'my default argument');
            }).to.not.throw();
        });

        it('should throw error if argument one is not a function', function() {
            expect(function() {
                Util.runSafeWithDefaultArg(null);
            }).to.throw('argument one is not a function');
        });

        it('should pass in null is the default argument if the second argument is not defined', function() {
            expect(Util.runSafeWithDefaultArg(function(arg){
                return arg;
            })).to.be.a('null');
        });

        it('should accept an optional execution scope object as a third argument', function() {
            let scope = {version: '1.0.0'},

                result = Util.runSafeWithDefaultArg(function(name) {
                    let version = this.version;
                    return {name, version};
                }, 'ForensicJS', scope);

            expect(result).to.deep.equals({
                name: 'ForensicJS',
                version: '1.0.0'
            });
        });

        it('should accept an optional fourth argument of extra parameter or array of extra parameters to pass in to executable', function() {
            let extraParameters = ['1.0.0', 'ForensicJS'],
                now = Date.now(),

                result = Util.runSafeWithDefaultArg(function(timestamp, version, name) {
                    return {timestamp, version, name};
                }, now, null, extraParameters);

            expect(result).to.deep.equals({
                timestamp: now,
                version: '1.0.0',
                name: 'ForensicJS'
            });
        });

        it('should accept an optional wait before execution parameter in milliseconds as a fifth parameter', function() {
            let startTime = Date.now();
            return Util.runSafeWithDefaultArg(() => Date.now() - startTime, 'default arg',
                null, null, 1000).then(result => expect(result).to.be.at.least(999));
        });

        it('should return a promise if given a wait parameter as fifth argument', function() {
            expect(Util.runSafeWithDefaultArg(function() {}, 'nothing much', null, null, 1000)).to.be.a('promise');
        });
    });

    describe('.camelCase(value, delimiter?)', function() {

        it('should apply camel like casing on the argument and return the result. default delimiter used is dash or underscore characters', function() {
            expect(Util.camelCase('my-dog')).to.equals('myDog');
        });

        it('should accept an optional delimiter string or regex pattern as a second argument', function() {
            expect(Util.camelCase('my dog is cool', ' ')).to.equals('myDogIsCool');
        });
    });

    describe('.loadInlineCSS(cssCode)', function() {
        it('should load the css code into the document and return the style element', function() {
            let elem = Util.loadInlineCSS(`
                body {
                    padding: 0;
                }
            `);
            expect(elem.nodeName.toLowerCase()).to.equals('style');
        });
    });

    describe('.nodeContains(containingNode, containedNode, useLegacyMethod?)', function() {

        it('should return true if argument two is a child node of argument one', function() {
            expect(Util.nodeContains(document, document.body)).to.be.true;
        });

        it('should return false if argument two is not a child node of argument one', function() {
            expect(Util.nodeContains(document.body, document.documentElement.firstChild)).to.be.false;
        });

        it (`should use legacy node.contains method rather than node.compareDocumentPosition if the useLegacyMethod
            parameter is set to true`, function() {
            let div = document.createElement('div');
            div.innerHTML = `<header>
                <h1 class="heading">this is my heading</h1>
            </header>`;

            let heading = div.getElementsByClassName('heading')[0];
            expect(Util.nodeContains(div, heading, true)).to.be.true;
            expect(Util.nodeContains(div, document.body, true)).to.be.false;
        });

        it('should return false if argument one is neither a document nor an element node', function() {
            expect(Util.nodeContains(document.createTextNode('this is a text node'))).to.be.false;
        });

        it('should return false if argument two is neither an element nor a text node', function() {
            let div = document.createElement('div');
            let attr = document.createAttribute('id');
            expect(Util.nodeContains(div, attr)).to.be.false;
        });
    });

    describe('.getRandomText(length?)', function() {
        it('should return a random text of the given length. Default value of length is 4', function() {
            expect(Util.getRandomText(6)).to.be.a('string').and.lengthOf(6);
            expect(Util.getRandomText()).to.be.a('string').and.lengthOf(4);
        });
    });

    describe('.mergeObjects(...objects)', function() {

        it(`should deeply merge all the comma separated list of object arguments and return
        the new object`, function() {
            let obj1 = {name: 'house1', details: {height: 30, width: 40}};
            let obj2 = {nickName: 'Finest House', details: {rooms: 40}, name: {value: 'house2'}};
            let obj3 = {oldName: 'Fine House', details: 'no details'};

            expect(Util.mergeObjects(obj1, obj2, obj3)).to.deep.equals({
                name: {value: 'house2'}, nickName: 'Finest House', oldName: 'Fine House',
                details: 'no details'
            });
        });

        it(`should ignore non plain object argument`, function() {
            let obj1 = {name: 'house1', details: {height: 30, width: 40}};
            let obj2 = {nickName: 'Finest House', details: {rooms: 40}};
            let obj3 = {oldName: 'Fine House', details: {height: 35}};

            expect(Util.mergeObjects(obj1, obj2, obj3, null)).to.deep.equals({
                name: 'house1', nickName: 'Finest House', oldName: 'Fine House',
                details: {height: 35, width: 40, rooms: 40}
            });
        });
    });
});