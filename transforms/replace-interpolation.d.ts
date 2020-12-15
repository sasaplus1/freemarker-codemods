import type { IToken } from 'freemarker-parser/types/interface/Tokens';
declare type Options = {
    from: string | RegExp | ((value: string) => string);
    to?: string;
};
export declare function transformer(tokens: IToken[], options: Options): IToken[];
export {};
