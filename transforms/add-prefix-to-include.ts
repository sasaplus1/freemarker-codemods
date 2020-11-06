import type { IToken } from 'freemarker-parser/types/interface/Tokens';

type Options = {
  from: string | RegExp | ((value: string) => string);
  to?: string;
};

export function transformer(tokens: IToken[], options: Options): IToken[] {
  return tokens.map(function (token) {
    const { params, text, type } = token;

    if (
      params === undefined ||
      type !== 'Directive' ||
      !/^include$/i.test(text)
    ) {
      return token;
    }

    // NOTE: unsupported attributes:
    // <#include "/path/to/file" encoding="utf-8" parse=false>
    // {
    //   type: 'Directive',
    //   start: 0,
    //   end: 57,
    //   startTag: '<#',
    //   endTag: '/>',
    //   text: 'include',
    //   params: '"/path/to/file" encoding="utf-8" parse=false ',
    //   isClose: false
    // }

    const includePath = params.replace(/["']+/g, '').trim();

    const { from, to } = options;

    let newParams = params;

    if (typeof from === 'string' && from === includePath) {
      newParams = ` "${to}"`;
    } else if (from instanceof RegExp && from.test(includePath)) {
      newParams = ` "${to}"`;
    } else if (typeof from === 'function') {
      newParams = ` "${from(includePath)}"`;
    }

    return { ...token, params: newParams };
  });
}
