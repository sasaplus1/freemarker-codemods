import type { IToken } from 'freemarker-parser/types/interface/Tokens';
import type { Codemods } from '../';
declare type Options = {
    paths: string[];
    recursive: number;
};
export declare function resolveInclude(includePath: string, options: Options, codemods: Codemods): IToken[];
export declare function transformer(tokens: IToken[], options: Options, codemods: Codemods): IToken[];
export {};
