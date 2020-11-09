declare type Params = {
    transformerOptions: any;
    transformerPath: string;
};
export declare function applyModifiedCode(filePath: string, params: Params): Promise<void>;
export declare function applyModifiedCodes(filePaths: string[], params: Params): Promise<void[]>;
export declare function transform(code: string, params: Params): string;
export {};
