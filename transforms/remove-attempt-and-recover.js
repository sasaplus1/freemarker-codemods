"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformer = void 0;
const debug = require("debug");
const log = debug('freemarker-codemods:remove-attempt-and-recover');
function transformer(tokens) {
    log('----- remove-attempt-and-recover -----');
    const result = [];
    let inAttempt = false;
    let inRecover = false;
    for (const token of tokens) {
        const { isClose, text, type } = token;
        // ignore <#attempt>
        if (type === 'Directive' && /^attempt$/i.test(text) && !isClose) {
            inAttempt = true;
            continue;
        }
        // ignore </#attempt>
        if (type === 'Directive' && /^attempt$/i.test(text) && isClose) {
            inAttempt = false;
            inRecover = false;
            continue;
        }
        // ignore <#recover>
        if (inAttempt && type === 'Directive' && /^recover$/i.test(text)) {
            inRecover = true;
            continue;
        }
        // ignore token if within <#recover>
        if (inRecover) {
            continue;
        }
        result.push(token);
    }
    return result;
}
exports.transformer = transformer;
//# sourceMappingURL=remove-attempt-and-recover.js.map