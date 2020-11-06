import assert = require('assert');

import { Parser } from 'freemarker-parser';
import { stringify } from 'freemarker-stringifier';

import { transformer } from './add-prefix-to-include';

describe('add-prefix-to-include', function () {
  const parser = new Parser();

  it('can update include path with string', function () {
    const html = ['<#include "/path/to/file">'].join('');

    const { tokens } = parser.parse(html);
    const newTokens = transformer(tokens, {
      from: '/path/to/file',
      to: '/foo/bar/baz'
    });
    const output = stringify(newTokens);

    const expect = ['<#include "/foo/bar/baz">'].join('');

    assert(output === expect);
  });
  it('can update include path with RegExp', function () {
    const html = ['<#include "/path/to/file">'].join('');

    const { tokens } = parser.parse(html);
    const newTokens = transformer(tokens, {
      from: /\/PATH\/TO\/FILE/i,
      to: '/foo/bar/baz'
    });
    const output = stringify(newTokens);

    const expect = ['<#include "/foo/bar/baz">'].join('');

    assert(output === expect);
  });
  it('can update include path with function', function () {
    const html = ['<#include "/path/to/file">'].join('');

    const { tokens } = parser.parse(html);
    const newTokens = transformer(tokens, {
      from(value) {
        return value.replace(/^\//, '/@root/');
      }
    });
    const output = stringify(newTokens);

    const expect = ['<#include "/@root/path/to/file">'].join('');

    assert(output === expect);
  });
});
