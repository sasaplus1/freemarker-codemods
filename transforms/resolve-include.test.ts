import assert = require('assert');

import * as path from 'path';

import { Parser } from 'freemarker-parser';
import { stringify } from 'freemarker-stringifier';

import { transformer } from './resolve-include';

describe('resolve-include', function () {
  const parser = new Parser();

  it('can resolve <#include> with relative path', function () {
    const html = [
      '<h1>It Works!</h1>',
      '<#include "./fixtures/resolve-include/a/a1.ftl">',
      '<#include "./fixtures/resolve-include/a/a2.ftl">'
    ].join('');

    const { tokens } = parser.parse(html);
    const newTokens = transformer(
      tokens,
      { paths: [], recursive: 10 },
      {
        // NOTE: it's dummy file path
        filePath: path.join(__dirname, '../unknown.ftl'),
        parse: parser.parse.bind(parser)
      }
    );
    const output = stringify(newTokens);

    const expect = [
      '<h1>It Works!</h1>',
      'a/a1.ftl\n',
      'a/common.ftl\n\n',
      'a/a2.ftl\n',
      'a/common.ftl\n\n'
    ].join('');

    assert(output === expect);
  });

  it('can resolve <#include> with absolute path', function () {
    const html = [
      '<h1>It Works!</h1>',
      '<#include "/fixtures/resolve-include/a/a1.ftl">',
      '<#include "/fixtures/resolve-include/a/a2.ftl">'
    ].join('');

    const { tokens } = parser.parse(html);
    const newTokens = transformer(
      tokens,
      { paths: [path.join(__dirname, '..')], recursive: 10 },
      {
        // NOTE: it's dummy file path
        filePath: path.join(__dirname, '../unknown.ftl'),
        parse: parser.parse.bind(parser)
      }
    );
    const output = stringify(newTokens);

    const expect = [
      '<h1>It Works!</h1>',
      'a/a1.ftl\n',
      'a/common.ftl\n\n',
      'a/a2.ftl\n',
      'a/common.ftl\n\n'
    ].join('');

    assert(output === expect);
  });
});
