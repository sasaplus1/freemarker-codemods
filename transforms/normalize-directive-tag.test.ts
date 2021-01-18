import assert = require('assert');

import { Parser } from 'freemarker-parser';
import { stringify } from 'freemarker-stringifier';

import { transformer } from './normalize-directive-tag';

describe('normalize-directive-tag', function () {
  const parser = new Parser();

  it('can normalize tags', function () {
    const html = [
      '<#assign x = 1>',
      '<#if true>1<#elseif true>2<#else>3</#if>'
    ].join('');

    const { tokens } = parser.parse(html);
    const newTokens = transformer(tokens);
    const output = stringify(newTokens);

    const expect = [
      '<#assign x = 1 />',
      '<#if true>1<#elseif true />2<#else />3</#if>'
    ].join('');

    assert(output === expect);
  });

  it('can normalize tags without prefix space', function () {
    const html = [
      '<#assign x = 1>',
      '<#if true>1<#elseif true>2<#else>3</#if>'
    ].join('');

    const { tokens } = parser.parse(html);
    const newTokens = transformer(tokens, { addSpaceToPrefix: false });
    const output = stringify(newTokens);

    const expect = [
      '<#assign x = 1/>',
      '<#if true>1<#elseif true/>2<#else/>3</#if>'
    ].join('');

    assert(output === expect);
  });
});
