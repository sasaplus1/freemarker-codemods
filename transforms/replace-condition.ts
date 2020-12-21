import * as debug from 'debug';

import type { IToken } from 'freemarker-parser/types/interface/Tokens';

type Options = {
  from: string | RegExp | ((value: string) => string);
  to?: string;
};

const log = debug('freemarker-codemods:replace-condition');

export function transformer(tokens: IToken[], options: Options): IToken[] {
  return tokens.map(function (token) {
    const { text, type } = token;

    if (type !== 'Directive' || !/^if$/i.test(text)) {
      return token;
    }

    log('----- replace-condition -----');
    log('token: %O', token);

    const { params = '' } = token;

    const { from, to } = options;

    let newParams = params;

    if (typeof from === 'string' && from === params) {
      newParams = to || '';
    } else if (from instanceof RegExp && from.test(params)) {
      newParams = to || '';
    } else if (typeof from === 'function') {
      newParams = from(params);
    } else {
      return token;
    }

    const newToken: IToken = {
      ...token,
      params: newParams
    };

    log('newToken: %O', newToken);

    return newToken;
  });
}
