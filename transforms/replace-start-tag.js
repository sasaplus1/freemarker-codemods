"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformer = void 0;
const debug = require("debug");
const log = debug('freemarker-codemods:replace-start-tag');
function transformer(tokens, options) {
    return tokens.map(function (token) {
        const { startTag } = token;
        if (!startTag) {
            return token;
        }
        log('----- replace-start-tag -----');
        log('token: %O', token);
        const { from, to } = options;
        let newStartTag = startTag;
        if (typeof from === 'string' && from === startTag) {
            newStartTag = to || '';
        }
        else if (from instanceof RegExp && from.test(startTag)) {
            newStartTag = to || '';
        }
        else if (typeof from === 'function') {
            newStartTag = from(startTag);
        }
        else {
            return token;
        }
        const newToken = {
            ...token,
            startTag: newStartTag
        };
        log('newToken: %O', newToken);
        return newToken;
    });
}
exports.transformer = transformer;
//# sourceMappingURL=replace-start-tag.js.map