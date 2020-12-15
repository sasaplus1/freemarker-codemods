"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformer = void 0;
const debug = require("debug");
const log = debug('freemarker-codemods:replace-interpolation');
function transformer(tokens, options) {
    return tokens.map(function (token) {
        const { type } = token;
        if (type !== 'Interpolation') {
            return token;
        }
        log('----- replace-interpolation -----');
        log('token: %O', token);
        const { end, params = '', start } = token;
        const { from, to } = options;
        let text = params;
        if (typeof from === 'string' && from === params) {
            text = to || '';
        }
        else if (from instanceof RegExp && from.test(params)) {
            text = to || '';
        }
        else if (typeof from === 'function') {
            text = from(params);
        }
        else {
            return token;
        }
        const newToken = {
            end,
            isClose: false,
            start,
            text,
            type: 'Text'
        };
        log('newToken: %O', newToken);
        return newToken;
    });
}
exports.transformer = transformer;
//# sourceMappingURL=replace-interpolation.js.map