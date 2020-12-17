import * as debug from 'debug';

import type { ENodeType } from 'freemarker-parser/types/Symbols';
import type { IToken } from 'freemarker-parser/types/interface/Tokens';

const log = debug('freemarker-codemods:convert-include-to-ejs-include');

function isIncludeToken(token: IToken): boolean {
  const { text, type } = token;

  return type === 'Directive' && /^include$/i.test(text);
}

export function transformer(tokens: IToken[]): IToken[] {
  return tokens.map(function (token) {
    const { params } = token;

    if (isIncludeToken(token) && typeof params === 'string') {
      log('----- convert-include-to-ejs-include -----');

      const { end, start } = token;

      const newToken: IToken = {
        end,
        isClose: false,
        start,
        text: `<%- include(${params}) %>`,
        type: 'Text' as ENodeType.Text
      };

      log('token: %O', token);
      log('newToken: %O', newToken);

      return newToken;
    }

    return token;
  });
}
