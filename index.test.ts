import assert = require('assert');

import { transform } from './index';

describe('index', function () {
  describe('transform', function () {
    it('can transform code', function () {
      const code = transform(
        ['<#include "/foo/bar/baz" />'].join(''),
        {
          transformerPath: require.resolve(
            __dirname + '/transforms/add-prefix-to-include.js'
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
});
