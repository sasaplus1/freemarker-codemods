import assert = require('assert');

import { Parser } from 'freemarker-parser';
import { stringify } from 'freemarker-stringifier';

import { transformer } from './convert-to-ejs-tag';

describe('convert-to-ejs-tag', function () {
  const parser = new Parser();

  it('can replace FreeMarker to EJS', function () {
    const html = [
      '<#if true>',
      'foo',
      '<#elseif false>',
      'bar',
      '<#else>',
      'baz',
      '</#if>',
      '<#assign x = 1 />'
    ].join('');

    const { tokens } = parser.parse(html);
    const newTokens = transformer(tokens);
    const output = stringify(newTokens);

    const expect = [
      '<%if (true){%>',
      'foo',
      '<%}else if (false){%>',
      'bar',
      '<%}else{%>',
      'baz',
      '<%}%>',
      '<%assign x = 1 %>'
    ].join('');

    assert(output === expect);
  });
  it('can replace Comment to EJS', function () {
    const html = [
      'Hello,',
      '<#-- comment -->',
      '<#comment>@@comment@@</#comment>',
      'World!'
    ].join('');

    const { tokens } = parser.parse(html);
    const newTokens = transformer(tokens);
    const output = stringify(newTokens);

    const expect = [
      'Hello,',
      '<%# comment %>',
      '<%#@@comment@@%>',
      'World!'
    ].join('');

    assert(output === expect);
  });
  it('can replace Include to EJS', function () {
    const html = ['<#include "/path/to/file">'].join('');

    const { tokens } = parser.parse(html);
    const newTokens = transformer(tokens);
    const output = stringify(newTokens);

    const expect = ['<%-include "/path/to/file"%>'].join('');

    assert(output === expect);
  });
});
