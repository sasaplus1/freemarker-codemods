import type { IToken } from 'freemarker-parser/types/interface/Tokens';

export function transformer(tokens: IToken[]): IToken[] {
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
