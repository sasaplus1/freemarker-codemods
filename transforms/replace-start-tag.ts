import * as debug from 'debug';

import type { IToken } from 'freemarker-parser/types/interface/Tokens';

type Options = {
  from: string | RegExp | ((value: string) => string);
  to?: string;
};

const log = debug('freemarker-codemods:replace-start-tag');

export function transformer(tokens: IToken[], options: Options): IToken[] {
  return tokens.map(function (token) {
    const { startTag } = token;

    if (!startTag) {
      return token;
    }

    log('----- replace-start-tag -----');
    log('token: %O', token);

    const { from, to } = options;

    let newStartTag = startTag;

    if (typeof from === 'string' && from === startTag) {
      newStartTag = to || '';
    } else if (from instanceof RegExp && from.test(startTag)) {
      newStartTag = to || '';
    } else if (typeof from === 'function') {
      newStartTag = from(startTag);
    } else {
      return token;
    }

    const newToken: IToken = {
      ...token,
      startTag: newStartTag
    };

    log('newToken: %O', newToken);

    return newToken;
  });
}
