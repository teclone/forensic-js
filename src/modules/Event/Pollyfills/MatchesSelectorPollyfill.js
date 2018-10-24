export default {
    install(host) {
        let proto = host.Element.prototype;

        /* istanbul ignore if */
        if (typeof proto.matches === 'undefined') {
            proto.matches = proto.matchesSelector || proto.mozMatchesSelector ||
                proto.msMatchesSelector || proto.oMatchesSelector ||
                proto.webkitMatchesSelector;
        }

        /* istanbul ignore if */
        if (typeof proto.matches === 'undefined') {
            proto.matches = function(css) {
                const matches = this.ownerDocument.querySelectorAll(css);
                let i = matches.length;

                while (--i >= 0 && matches.item(i) !== this);
                return i > -1;
            };
        }
    }
};