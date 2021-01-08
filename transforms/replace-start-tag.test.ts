import assert = require('assert');

import { Parser } from 'freemarker-parser';
import { stringify } from 'freemarker-stringifier';

import { transformer } from './replace-start-tag';

describe('replace-start-tag', function () {
  const parser = new Parser();

  it('can replace FreeMarker start tag', function () {
    const html = ['<#function>foobar</#function>'].join('');

    const { tokens } = parser.parse(html);
    const newTokens = transformer(tokens, {
      from(value) {
        switch (value) {
          case '<#':
            return '<ftl-';
          case '</#':
            return '</ftl-';
          default:
            return value;
        }
      }
    });
    const output = stringify(newTokens);

    const expect = ['<ftl-function>foobar</ftl-function>'].join('');

    assert(output === expect);
  });
});
