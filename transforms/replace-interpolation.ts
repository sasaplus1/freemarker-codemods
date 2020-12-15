import type { ENodeType } from 'freemarker-parser/types/Symbols';
import type { IToken } from 'freemarker-parser/types/interface/Tokens';

type Options = {
  from: string | RegExp | ((value: string) => string);
  to?: string;
};

export function transformer(tokens: IToken[], options: Options): IToken[] {
  return tokens.map(function (token) {
    const { type } = token;

    if (type !== 'Interpolation') {
      return token;
    }

    const { end, params = '', start } = token;

    const { from, to } = options;

    let text = params;

    if (typeof from === 'string' && from === params) {
      text = to || '';
    } else if (from instanceof RegExp && from.test(params)) {
      text = to || '';
    } else if (typeof from === 'function') {
      text = from(params);
    } else {
      return token;
    }

    const newToken: IToken = {
      end,
      isClose: false,
      start,
      text,
      type: 'Text' as ENodeType.Text
    };

    return newToken;
  });
}
