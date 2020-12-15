import * as debug from 'debug';

import type { IToken } from 'freemarker-parser/types/interface/Tokens';

const log = debug('freemarker-codemods:remove-attempt-and-recover');

export function transformer(tokens: IToken[]): IToken[] {
  log('----- remove-attempt-and-recover -----');

  const result: IToken[] = [];

  let inAttempt = false;
  let inRecover = false;

  for (const token of tokens) {
    const { isClose, text, type } = token;

    // ignore <#attempt>
    if (type === 'Directive' && /^attempt$/i.test(text) && !isClose) {
      inAttempt = true;
      continue;
    }

    // ignore </#attempt>
    if (type === 'Directive' && /^attempt$/i.test(text) && isClose) {
      inAttempt = false;
      inRecover = false;
      continue;
    }

    // ignore <#recover>
    if (inAttempt && type === 'Directive' && /^recover$/i.test(text)) {
      inRecover = true;
      continue;
    }

    // ignore token if within <#recover>
    if (inRecover) {
      continue;
    }

    result.push(token);
  }

  return result;
}
