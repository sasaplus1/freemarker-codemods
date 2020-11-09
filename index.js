"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transform = exports.applyModifiedCodes = exports.applyModifiedCode = void 0;
const fs_1 = require("fs");
const freemarker_parser_1 = require("freemarker-parser");
const freemarker_stringifier_1 = require("freemarker-stringifier");
const parser = new freemarker_parser_1.Parser();
const parse = parser.parse.bind(parser);
async function applyModifiedCode(filePath, params) {
    const code = await fs_1.promises.readFile(filePath, 'utf8');
    const modifiedCode = transform(code, params);
    await fs_1.promises.writeFile(filePath, modifiedCode, 'utf8');
}
exports.applyModifiedCode = applyModifiedCode;
function applyModifiedCodes(filePaths, params) {
    return Promise.all(filePaths.map((filePath) => applyModifiedCode(filePath, params)));
}
exports.applyModifiedCodes = applyModifiedCodes;
function transform(code, params) {
    const { transformerPath, transformerOptions } = params;
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { transformer } = require(transformerPath);
    const { tokens } = parse(code);
    return freemarker_stringifier_1.stringify(transformer(tokens, transformerOptions));
}
exports.transform = transform;
//# sourceMappingURL=index.js.map