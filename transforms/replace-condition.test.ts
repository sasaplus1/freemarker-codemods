import assert = require('assert');

import { Parser } from 'freemarker-parser';
import { stringify } from 'freemarker-stringifier';

import { transformer } from './replace-condition';

describe('replace-condition', function () {
  const parser = new Parser();

  it('can replace if condition with string', function () {
    const html = ['<#if foo == true>1<else>2</#if>'].join('');

    const { tokens } = parser.parse(html);
    const newTokens = transformer(tokens, {
      from: 'foo == true',
      to: 'true'
    });
    const output = stringify(newTokens);

    const expect = ['<#if true>1<else>2</#if>'].join('');

    assert(output === expect);
  });
  it('cat replace if condition with RegExp', function () {
    const html = ['<#if foo == true>1<else>2</#if>'].join('');

    const { tokens } = parser.parse(html);
    const newTokens = transformer(tokens, {
      from: /foo == TRUE/i,
      to: 'false'
    });
    const output = stringify(newTokens);

    const expect = ['<#if false>1<else>2</#if>'].join('');

    assert(output === expect);
  });
  it('can replace if condition with function', function () {
    const html = ['<#if foo == true>1<else>2</#if>'].join('');

    const { tokens } = parser.parse(html);
    const newTokens = transformer(tokens, {
      from(value) {
        return value.replace(/foo/i, 'bar');
      }
    });
    const output = stringify(newTokens);

    const expect = ['<#if bar == true>1<else>2</#if>'].join('');

    assert(output === expect);
  });
});
