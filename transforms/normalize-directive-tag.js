"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformer = void 0;
const debug = require("debug");
const log = debug('freemarker-codemods:normalize-directive-tag');
const emptyElements = [
    'recover',
    'flush',
    'ftl',
    'return',
    'elseif',
    'else',
    'import',
    'include',
    'nested',
    'nt',
    'setting',
    'case',
    'default',
    'break',
    't',
    'lt',
    'rt',
    'visit',
    'recurse',
    'fallback'
];
const re = new RegExp(`^(?:${emptyElements.join('|')})$`, 'i');
function isEmptyAssignDirective(token) {
    const { params, text, type } = token;
    return (type === 'Directive' &&
        params !== undefined &&
        /^(?:global|assign|local)$/i.test(text));
}
function transformer(tokens, options = { addSpaceToPrefix: true }) {
    const { addSpaceToPrefix } = options;
    return tokens.map(function (token) {
        const { type, text } = token;
        if (type !== 'Directive') {
            return token;
        }
        if (!re.test(text) && !isEmptyAssignDirective(token)) {
            return token;
        }
        log('----- normalize-directive-tag -----');
        log('token: %O', token);
        const newToken = {
            ...token,
            endTag: addSpaceToPrefix ? ' />' : '/>'
        };
        log('newToken: %O', newToken);
        return newToken;
    });
}
exports.transformer = transformer;
//# sourceMappingURL=normalize-directive-tag.js.map