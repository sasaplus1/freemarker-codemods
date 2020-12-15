"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformer = void 0;
const debug = require("debug");
const log = debug('freemarker-codemods:add-prefix-to-include');
function transformer(tokens, options) {
    return tokens.map(function (token) {
        const { params, text, type } = token;
        if (params === undefined ||
            type !== 'Directive' ||
            !/^include$/i.test(text)) {
            return token;
        }
        // NOTE: unsupported attributes:
        // <#include "/path/to/file" encoding="utf-8" parse=false>
        // {
        //   type: 'Directive',
        //   start: 0,
        //   end: 57,
        //   startTag: '<#',
        //   endTag: '/>',
        //   text: 'include',
        //   params: '"/path/to/file" encoding="utf-8" parse=false ',
        //   isClose: false
        // }
        log('----- add-prefix-to-include -----');
        const includePath = params.replace(/["']+/g, '').trim();
        const { from, to } = options;
        let newParams = params;
        if (typeof from === 'string' && from === includePath) {
            newParams = `"${to}"`;
        }
        else if (from instanceof RegExp && from.test(includePath)) {
            newParams = `"${to}"`;
        }
        else if (typeof from === 'function') {
            newParams = `"${from(includePath)}"`;
        }
        const newToken = { ...token, params: newParams };
        log('token: %O', token);
        log('newToken: %O', newToken);
        return newToken;
    });
}
exports.transformer = transformer;
//# sourceMappingURL=add-prefix-to-include.js.map