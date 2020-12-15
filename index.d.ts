export declare type Codemods = {
    filePath: string;
    parse: typeof parse;
};
declare type Params = {
    transformerOptions: any;
    transformerPath: string;
};
declare type Context = {
    filePath: string;
};
declare const parse: (template: string, options?: import("freemarker-parser/types/Tokenizer").ITokenizerOptions | undefined) => import("freemarker-parser/types/Parser").IParserReturn;
export declare function applyModifiedCode(filePath: string, params: Params): Promise<void>;
export declare function applyModifiedCodes(filePaths: string[], params: Params): Promise<void[]>;
export declare function transform(code: string, params: Params, context: Context): string;
export {};
