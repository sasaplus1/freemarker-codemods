"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformer = void 0;
const debug = require("debug");
const log = debug('freemarker-codemods:convert-include-to-ejs-include');
function isIncludeToken(token) {
    const { text, type } = token;
    return type === 'Directive' && /^include$/i.test(text);
}
function transformer(tokens) {
    return tokens.map(function (token) {
        const { params } = token;
        if (isIncludeToken(token) && typeof params === 'string') {
            log('----- convert-include-to-ejs-include -----');
            const { end, start } = token;
            const newToken = {
                end,
                isClose: false,
                start,
                text: `<%- include(${params}) %>`,
                type: 'Text'
            };
            log('token: %O', token);
            log('newToken: %O', newToken);
            return newToken;
        }
        return token;
    });
}
exports.transformer = transformer;
//# sourceMappingURL=convert-include-to-ejs-include.js.map