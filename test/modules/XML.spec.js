import XML from './../../src/modules/XML.js';

describe('XML module', function() {
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
            expect(XML.install(window, document)).to.be.false;
        });
    });

    describe('.uninstall()', function() {
        it('should call the global uninstall method', function() {
            expect(XML.uninstall()).to.be.true;
            expect(XML.install(window, document)).to.be.true;
        });
    });

    describe('.supported', function() {
        it('it should hold a boolean value that indicates if XML creation is supported', function() {
            expect(XML.supported).to.be.true;
        });
    });

    describe('.ieString', function() {
        it(`should hold the MSXML version string used in creating the request if the
        environment is running in a trident engine that implements XML through ActiveXObject`, function() {
            expect(XML.ieString).to.be.a('string');
        });
    });

    describe('#constructor(rootName?, namespaces?, documentType?)', function() {
        it(`should create an XML instance object`, function() {
            expect(new XML()).to.be.an('XML');
        });

        it(`should take an optional element qualified name as first parameter and
            initialize the document with it`, function() {
            expect(new XML('html').document.documentElement.nodeName.toLowerCase())
                .to.equals('html');
        });

        it(`should take an optional object containing namespace prefix to namespace uri key:value
        pairs that should be declared on the root element. default prefix`, function() {
            let namespaces = {
                default: 'http://fjsfoundations.com/xml',
                svg: 'http://www.w3.org/2000/svg',
                html: 'http://www.w3.org/1999/xhtml'
            };

            let xml = new XML('custom', namespaces);
            expect(xml.document.documentElement.nodeName.toLowerCase()).to.equals('custom');
        });
    });

    describe('#load(url)', function() {
        it(`should fetch and load the xml resource from the given url and return a promise`, function() {
            let xml = new XML();
            expect(xml.load('test/helpers/correct.xml')).to.be.a('Promise');
        });

        it(`should resolve and pass in the resulting xml document as the resolver argument if the
        xml resource was parsed successfully`, function() {
            let xml = new XML();
            return xml.load('test/helpers/correct.xml').then(xmlDoc => {
                expect(xmlDoc.nodeType).to.equals(9);
            });
        });

        it(`should reject and pass in the resulting erronous xml document as the rejector argument if the
        xml resource could not be loaded or could not be parsed successfully`, function() {
            let xml = new XML('root');
            return xml.load('test/helpers/erronous.xml').catch(xmlDoc => {
                expect(xmlDoc.parseError.errorCode).to.be.greaterThan(0);
            });
        });

        it(`should reject if error occured while fetching resource`, function() {
            let xml = new XML();
            return xml.load('test/helpers/unexisting.xml').catch(xmlDoc => {
                expect(xmlDoc.parseError.errorCode).to.be.greaterThan(0);
            });
        });
    });

    describe('#loadXML(xmlString)', function() {
        it(`should parse and load the given xml string and return a promise`, function() {
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
            `,
                xml = new XML();

            expect(xml.loadXML(xmlString)).to.be.a('Promise');
        });

        it(`should resolve and pass in the resulting xml document as the resolver argument if the
        xmlString was parsed successfully`, function() {
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
            `,
                xml = new XML();

            return xml.loadXML(xmlString).then(xmlDoc => {
                expect(xmlDoc.nodeType).to.equals(9);
            });
        });

        it(`should reject and pass in the resulting erronous xml document as the rejector argument if the
        xml resource could not be parsed successfully`, function() {
            let xmlString = `
                <?xml version="1.0" encoding="utf-8" ?>
                <students>
                    <!--make this erronous-->
                    <student
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
            `,
                xml = new XML();

            return xml.loadXML(xmlString).catch(xmlDoc => {
                expect(xmlDoc.parseError.errorCode).to.be.greaterThan(0);
                expect(xmlDoc.parseError.line).to.satisfy(line => line == 4 || line == 5);
            });
        });
    });

    describe('#document', function() {
        it(`should hold the xml document`, function() {
            expect(new XML().document.nodeType).to.be.equals(9);
        });
    });

    describe('Extensions to Node', function() {
        describe('Node#xml', function() {
            it('should serialize the node and return the serialized string', function() {
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
                `,
                    xml = new XML();

                return xml.loadXML(xmlString).then(xmlDoc => {
                    expect(xmlDoc.xml).to.be.string;
                });
            });
        });

        describe('Node#text', function() {
            it('should return the contenated text of the given node and its descendant nodes', function() {
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
                `,
                    xml = new XML();

                return xml.loadXML(xmlString).then(xmlDoc => {
                    expect(xmlDoc.text).to.be.string;
                });
            });
        });
    });
});