import * as debug from 'debug';

import type { IToken } from 'freemarker-parser/types/interface/Tokens';

type Options = {
  addSpaceToPrefix: boolean;
};

const log = debug('freemarker-codemods:normalize-directive-tag');

const emptyElements = [
  'recover',
  'flush',
  'ftl',
  'return',
  'elseif',
  'else',
  'import',
  'include',
  'nested',
  'nt',
  'setting',
  'case',
  'default',
  'break',
  't',
  'lt',
  'rt',
  'visit',
  'recurse',
  'fallback'
];

const re = new RegExp(`^(?:${emptyElements.join('|')})$`, 'i');

function isEmptyAssignDirective(token: IToken): boolean {
  const { params, text, type } = token;

  return (
    type === 'Directive' &&
    params !== undefined &&
    /^(?:global|assign|local)$/i.test(text)
  );
}

export function transformer(
  tokens: IToken[],
  options: Options = { addSpaceToPrefix: true }
): IToken[] {
  const { addSpaceToPrefix } = options;

  return tokens.map(function (token) {
    const { type, text } = token;

    if (type !== 'Directive') {
      return token;
    }

    if (!re.test(text) && !isEmptyAssignDirective(token)) {
      return token;
    }

    log('----- normalize-directive-tag -----');
    log('token: %O', token);

    const newToken: IToken = {
      ...token,
      endTag: addSpaceToPrefix ? ' />' : '/>'
    };

    log('newToken: %O', newToken);

    return newToken;
  });
}
