"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformer = void 0;
const debug = require("debug");
const log = debug('freemarker-codemods:replace-condition');
function transformer(tokens, options) {
    return tokens.map(function (token) {
        const { text, type } = token;
        if (type !== 'Directive' || !/^if$/i.test(text)) {
            return token;
        }
        log('----- replace-condition -----');
        log('token: %O', token);
        const { params = '' } = token;
        const { from, to } = options;
        let newParams = params;
        if (typeof from === 'string' && from === params) {
            newParams = to || '';
        }
        else if (from instanceof RegExp && from.test(params)) {
            newParams = to || '';
        }
        else if (typeof from === 'function') {
            newParams = from(params);
        }
        else {
            return token;
        }
        const newToken = {
            ...token,
            params: newParams
        };
        log('newToken: %O', newToken);
        return newToken;
    });
}
exports.transformer = transformer;
//# sourceMappingURL=replace-condition.js.map