"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformer = void 0;
function transformer(tokens) {
    return tokens.map(function (token) {
        const { type } = token;
        if (type !== 'Comment') {
            return token;
        }
        const { end, text = '', start } = token;
        const newToken = {
            end,
            isClose: false,
            start,
            text: `<!--${text}-->`,
            type: 'Text'
        };
        return newToken;
    });
}
exports.transformer = transformer;
//# sourceMappingURL=convert-comment-to-html-comment.js.map