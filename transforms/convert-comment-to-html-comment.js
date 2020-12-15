"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformer = void 0;
const debug = require("debug");
const log = debug('freemarker-codemods:convert-comment-to-html-comment');
function transformer(tokens) {
    return tokens.map(function (token) {
        const { type } = token;
        if (type !== 'Comment') {
            return token;
        }
        log('----- convert-comment-to-html-comment -----');
        const { end, text = '', start } = token;
        const newToken = {
            end,
            isClose: false,
            start,
            text: `<!--${text}-->`,
            type: 'Text'
        };
        log('token: %O', token);
        log('newToken: %O', newToken);
        return newToken;
    });
}
exports.transformer = transformer;
//# sourceMappingURL=convert-comment-to-html-comment.js.map