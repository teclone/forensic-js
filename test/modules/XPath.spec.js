import XPath from './../../src/modules/XPath.js';
import XML from '../../src/modules/XML.js';

describe('XPath module', function() {
    //start up server in node.js environment before any test begins
    before(function() {
        if (typeof server !== 'undefined') {
            server.listen();
        }
    });

    //close up server in node.js environment after running tests
    after(function() {
        if (typeof server !== 'undefined') {
            server.close();
        }
    });

    describe('.install(hostParam, rootParam)', function() {
        it('should call the global install method with the given parameter', function() {
            expect(XPath.install(window, document)).to.be.false;
        });
    });

    describe('.uninstall()', function() {
        it('should call the global uninstall method', function() {
            expect(XPath.uninstall()).to.be.true;
            expect(XPath.install(window, document)).to.be.true;
        });
    });

    describe('.supported', function() {
        it('it should hold a boolean value that indicates if XPath is supported', function() {
            expect(XPath.supported).to.be.true;
        });
    });

    describe('.implementation', function() {
        it(`it should hold an integer that indicates the XPath implementation type`, function() {
            expect(XPath.implementation).to.equals(2);
        });
    });

    describe('.selectNode(selector, node, namespaces)', function() {
        it(`it should select the first node that matches the given xPath selector, under the given
        node context`, function() {
            let xmlString = `
                <?xml version="1.0" encoding="utf-8" ?>
                <students>
                    <student>
                        <name>Harrison Ifeanyichukwu</name>
                        <class>JSS3</class>
                        <rating>0.7</rating>
                    </student>
                    <student>
                        <name>Helen Brown</name>
                        <class>JSS3</class>
                        <rating>0.9</rating>
                    </student>
                </students>
            `;

            return new XML().loadXML(xmlString).then(function(xmlDoc) {
                expect(XPath.selectNode('students/student/name', xmlDoc).text).to.equals('Harrison Ifeanyichukwu');
            });
        });

        it(`it select the first node that matches the given xPath selector, under the node context
        using the optional namespaces object`, function() {
            let xmlString = `
                <?xml version="1.0" encoding="utf-8" ?>
                <students xmlns="http://student.org/ns">
                    <student>
                        <name>Harrison Ifeanyichukwu</name>
                        <class>JSS3</class>
                        <rating>0.7</rating>
                    </student>
                    <student>
                        <name>Helen Brown</name>
                        <class>JSS3</class>
                        <rating>0.9</rating>
                    </student>
                </students>
            `;

            let namespaces = {st: 'http://student.org/ns'};

            return new XML().loadXML(xmlString).then(function(xmlDoc) {
                expect(XPath.selectNode('st:students/st:student/st:name', xmlDoc, namespaces)
                    .text).to.equals('Harrison Ifeanyichukwu');
                expect(XPath.selectNode('st:student/st:name', xmlDoc.documentElement, namespaces)
                    .text).to.equals('Harrison Ifeanyichukwu');
            });
        });

        it(`should throw error if argument one is not a selector string`, function() {
            expect(function() {
                XPath.selectNode(null);
            }).to.throw(TypeError);
        });

        it(`should throw error if argument two is not a document nor element node`, function() {
            expect(function() {
                XPath.selectNode('students/student/name', null);
            }).to.throw(TypeError);
        });
    });
});