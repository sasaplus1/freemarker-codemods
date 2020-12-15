"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformer = void 0;
const debug = require("debug");
const log = debug('freemarker-codemods:convert-comment-directive-to-html-comment');
function transformer(tokens) {
    return tokens.map(function (token) {
        const { text, type } = token;
        if (type !== 'Directive' || !/^comment$/i.test(text)) {
            return token;
        }
        log('----- convert-comment-directive-to-html-comment -----');
        const { end, isClose, start } = token;
        const newToken = {
            end,
            isClose: false,
            start,
            text: isClose ? '-->' : '<!--',
            type: 'Text'
        };
        log('token: %O', token);
        log('newToken: %O', newToken);
        return newToken;
    });
}
exports.transformer = transformer;
//# sourceMappingURL=convert-comment-directive-to-html-comment.js.map