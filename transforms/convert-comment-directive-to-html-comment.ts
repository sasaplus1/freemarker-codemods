import * as debug from 'debug';

import type { ENodeType } from 'freemarker-parser/types/Symbols';
import type { IToken } from 'freemarker-parser/types/interface/Tokens';

const log = debug(
  'freemarker-codemods:convert-comment-directive-to-html-comment'
);

export function transformer(tokens: IToken[]): IToken[] {
  return tokens.map(function (token) {
    const { text, type } = token;

    if (type !== 'Directive' || !/^comment$/i.test(text)) {
      return token;
    }

    log('----- convert-comment-directive-to-html-comment -----');

    const { end, isClose, start } = token;

    const newToken: IToken = {
      end,
      isClose: false,
      start,
      text: isClose ? '-->' : '<!--',
      type: 'Text' as ENodeType.Text
    };

    log('token: %O', token);
    log('newToken: %O', newToken);

    return newToken;
  });
}
