import assert = require('assert');

import { Parser } from 'freemarker-parser';
import { stringify } from 'freemarker-stringifier';

import { transformer } from './convert-comment-to-html-comment';

describe('convert-comment-to-html-comment', function () {
  const parser = new Parser();

  it('can replace comment to HTML comment', function () {
    const html = ['<#-- It Works! -->'].join('');

    const { tokens } = parser.parse(html);
    const newTokens = transformer(tokens);
    const output = stringify(newTokens);

    const expect = ['<!-- It Works! -->'].join('');

    assert(output === expect);
  });
});
