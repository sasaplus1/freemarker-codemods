import assert = require('assert');

import { Parser } from 'freemarker-parser';
import { stringify } from 'freemarker-stringifier';

import { transformer } from './convert-include-to-ejs-include';

describe('convert-include-to-ejs-include', function () {
  const parser = new Parser();

  it('can replace include directive to ejs include', function () {
    const html = ['<#include "/path/to/file">'].join('');

    const { tokens } = parser.parse(html);
    const newTokens = transformer(tokens);
    const output = stringify(newTokens);

    const expect = ['<%- include("/path/to/file") %>'].join('');

    assert(output === expect);
  });
});
