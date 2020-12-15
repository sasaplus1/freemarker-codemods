import type { ENodeType } from 'freemarker-parser/types/Symbols';
import type { IToken } from 'freemarker-parser/types/interface/Tokens';

export function transformer(tokens: IToken[]): IToken[] {
  return tokens.map(function (token) {
    const { type } = token;

    if (type !== 'Comment') {
      return token;
    }

    const { end, text = '', start } = token;

    const newToken: IToken = {
      end,
      isClose: false,
      start,
      text: `<!--${text}-->`,
      type: 'Text' as ENodeType.Text
    };

    return newToken;
  });
}
