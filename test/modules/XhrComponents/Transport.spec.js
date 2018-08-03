import Transport from '../../../src/modules/XhrComponents/Transport.js';

describe('XhrComponents.Transport', function() {
    describe('.create()', function() {
        it(`should create an xhr transport object`, function() {
            expect(Transport.create()).to.be.an('XMLHttpRequest');
        });
    });

    describe('.supported', function() {
        it(`should return a boolean indicating if transport objects can be created`, function() {
            expect(Transport.supported).to.be.true;
        });
    });

    describe('.ieString', function() {
        it(`should return a string indicating the MSXML version string used in created the
        xmlhttprequest activeXobject, assuming it is running in ie`, function() {
            expect(Transport.ieString).to.be.string;
        });
    });
});