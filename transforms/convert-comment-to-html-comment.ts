import * as debug from 'debug';

import type { ENodeType } from 'freemarker-parser/types/Symbols';
import type { IToken } from 'freemarker-parser/types/interface/Tokens';

const log = debug('freemarker-codemods:convert-comment-to-html-comment');

export function transformer(tokens: IToken[]): IToken[] {
  return tokens.map(function (token) {
    const { type } = token;

    if (type !== 'Comment') {
      return token;
    }

    log('----- convert-comment-to-html-comment -----');

    const { end, text = '', start } = token;

    const newToken: IToken = {
      end,
      isClose: false,
      start,
      text: `<!--${text}-->`,
      type: 'Text' as ENodeType.Text
    };

    log('token: %O', token);
    log('newToken: %O', newToken);

    return newToken;
  });
}
