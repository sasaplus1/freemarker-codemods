import assert = require('assert');

import { Parser } from 'freemarker-parser';

import { transform, transformTokens } from './index';

describe('index', function () {
  describe('transform', function () {
    it('can transform code', function () {
      const code = transform(
        ['<#include "/foo/bar/baz" />'].join(''),
        {
          transformerPath: require.resolve(
            './transforms/add-prefix-to-include'
          ),
          transformerOptions: {
            from: '/foo/bar/baz',
            to: '/path/to/file'
          }
        },
        { filePath: '' }
      );

      assert(code === '<#include "/path/to/file"/>');
    });
  });

  describe('transformTokens', function () {
    it('can transform tokens', function () {
      const parser = new Parser();
      const { tokens } = parser.parse(['<#include "/foo/bar/baz" />'].join(''));

      const newTokens = transformTokens(
        tokens,
        {
          transformerPath: require.resolve(
            './transforms/add-prefix-to-include'
          ),
          transformerOptions: { from: '/foo/bar/baz', to: '/path/to/file' }
        },
        { filePath: '' }
      );

      assert.deepStrictEqual(newTokens, [
        {
          end: 27,
          endTag: '/>',
          isClose: false,
          params: '"/path/to/file"',
          start: 0,
          startTag: '<#',
          text: 'include',
          type: 'Directive'
        }
      ]);
    });
  });
});
