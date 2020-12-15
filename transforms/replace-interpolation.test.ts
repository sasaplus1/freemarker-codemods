import assert = require('assert');

import { Parser } from 'freemarker-parser';
import { stringify } from 'freemarker-stringifier';

import { transformer } from './replace-interpolation';

describe('replace-interpolation', function () {
  const parser = new Parser();

  it('can replace interpolation with string', function () {
    const html = ['<h1>${value}</h1>'].join('');

    const { tokens } = parser.parse(html);
    const newTokens = transformer(tokens, {
      from: 'value',
      to: 'It Works!'
    });
    const output = stringify(newTokens);

    const expect = ['<h1>It Works!</h1>'].join('');

    assert(output === expect);
  });

  it('can replace interpolation with RegExp', function () {
    const html = ['<h1>${value}</h1>'].join('');

    const { tokens } = parser.parse(html);
    const newTokens = transformer(tokens, {
      from: /VALUE/i,
      to: 'It Works!'
    });
    const output = stringify(newTokens);

    const expect = ['<h1>It Works!</h1>'].join('');

    assert(output === expect);
  });

  it('can replace interpolation with Function', function () {
    const html = ['<h1>${value}</h1>', '<h2>${label}</h2>'].join('');

    const { tokens } = parser.parse(html);
    const newTokens = transformer(tokens, {
      from(value) {
        return value.toUpperCase();
      }
    });
    const output = stringify(newTokens);

    const expect = ['<h1>VALUE</h1>', '<h2>LABEL</h2>'].join('');

    assert(output === expect);
  });
});
