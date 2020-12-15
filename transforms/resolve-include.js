"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformer = exports.resolveInclude = void 0;
const fs = require("fs");
const path = require("path");
const debug = require("debug");
const log = debug('freemarker-codemods:resolve-include');
function extractIncludePath(includePath) {
    return includePath.replace(/["']+/g, '').trim();
}
function isIncludeToken(token) {
    const { text, type } = token;
    return type === 'Directive' && /^include$/i.test(text);
}
function resolveInclude(includePath, options, codemods) {
    log('----- resolveInclude -----');
    log('includePath: %s', includePath);
    log('options: %O', options);
    log('codemods: %O', codemods);
    const { paths } = options;
    const { filePath } = codemods;
    let includeFile = '';
    let resolvePaths = paths;
    if (/^\.{1,2}\//.test(includePath)) {
        // NOTE: concat to base file's dir if relative path
        includeFile = path.join(path.dirname(filePath), includePath);
    }
    else {
        // to ./file.ftl
        includeFile = './' + path.basename(includePath);
        // to ['/resolve/path/and/path/to']
        resolvePaths = paths.map((resolvePath) => path.join(resolvePath, path.dirname(includePath)));
    }
    log('includeFile: %s', includeFile);
    log('resolvePaths: %O', resolvePaths);
    let templateFile = '';
    try {
        templateFile = require.resolve(includeFile, { paths: resolvePaths });
    }
    catch (error) {
        // end: 17
        // endTag: "-->"
        // isClose: false
        // params: undefined
        // start: 0
        // startTag: "<#--"
        // text: " hogehoge "
        // type: "Comment"
        console.error(error);
        return [];
    }
    log('templateFile: %s', templateFile);
    const template = fs.readFileSync(templateFile, 'utf8');
    const { parse } = codemods;
    const { tokens } = parse(template);
    if (options.recursive <= 0) {
        return tokens;
    }
    const result = [];
    for (const token of tokens) {
        const { params } = token;
        if (isIncludeToken(token) && typeof params === 'string') {
            const includeTokens = resolveInclude(extractIncludePath(params), { ...options, recursive: options.recursive - 1 }, { ...codemods, filePath: templateFile });
            result.push(...includeTokens);
            continue;
        }
        result.push(token);
    }
    return result;
}
exports.resolveInclude = resolveInclude;
function transformer(tokens, options, codemods) {
    const result = [];
    for (const token of tokens) {
        const { params } = token;
        if (isIncludeToken(token) && typeof params === 'string') {
            const { recursive = 10 } = options;
            const includeTokens = resolveInclude(extractIncludePath(params), 
            // NOTE: tsc shows 2783 error if write { recursive: 10, ...options }
            { ...options, recursive }, codemods);
            result.push(...includeTokens);
            continue;
        }
        result.push(token);
    }
    return result;
}
exports.transformer = transformer;
//# sourceMappingURL=resolve-include.js.map