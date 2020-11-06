import assert = require('assert');

import { Parser } from 'freemarker-parser';
import { stringify } from 'freemarker-stringifier';

import { transformer } from './remove-attempt-and-recover';

describe('remove-attempt-and-recover', function () {
  const parser = new Parser();

  it('can remove <#attempt> and <#recover>', function () {
    const html = [
      '<h1>It Works!</h1>',
      '<#attempt>',
      'Hello!',
      '<#recover>',
      'Oops!',
      '</#attempt>',
      '<p>after</p>'
    ].join('');

    const { tokens } = parser.parse(html);
    const newTokens = transformer(tokens);
    const output = stringify(newTokens);

    const expect = ['<h1>It Works!</h1>', 'Hello!', '<p>after</p>'].join('');

    assert(output === expect);
  });
});
