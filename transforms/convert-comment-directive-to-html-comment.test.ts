import assert = require('assert');

import { Parser } from 'freemarker-parser';
import { stringify } from 'freemarker-stringifier';

import { transformer } from './convert-comment-directive-to-html-comment';

describe('convert-comment-directive-to-html-comment', function () {
  const parser = new Parser();

  it('can replace comment directive to HTML comment', function () {
    const html = ['<#comment>It Works!</#comment>'].join('');

    const { tokens } = parser.parse(html);
    const newTokens = transformer(tokens);
    const output = stringify(newTokens);

    const expect = ['<!--It Works!-->'].join('');

    assert(output === expect);
  });

  it('can replace comment directive within tags', function () {
    const html = [
      '<#comment>',
      '<#assign x = 1 />',
      'It Works!',
      '<p>foo</p>',
      '</#comment>'
    ].join('');

    const { tokens } = parser.parse(html);
    const newTokens = transformer(tokens);
    const output = stringify(newTokens);

    const expect = [
      '<!--',
      '<#assign x = 1 />',
      'It Works!',
      '<p>foo</p>',
      '-->'
    ].join('');

    assert(output === expect);
  });
});
