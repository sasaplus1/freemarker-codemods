import { promises as fs } from 'fs';

import { Parser } from 'freemarker-parser';
import { stringify } from 'freemarker-stringifier';

type Params = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transformerOptions: any;
  transformerPath: string;
};

const parser = new Parser();
const parse = parser.parse.bind(parser);

export async function applyModifiedCode(
  filePath: string,
  params: Params
): Promise<void> {
  const code = await fs.readFile(filePath, 'utf8');
  const modifiedCode = transform(code, params);

  await fs.writeFile(filePath, modifiedCode, 'utf8');
}

export function applyModifiedCodes(
  filePaths: string[],
  params: Params
): Promise<void[]> {
  return Promise.all(
    filePaths.map((filePath) => applyModifiedCode(filePath, params))
  );
}

export function transform(code: string, params: Params): string {
  const { transformerPath, transformerOptions } = params;

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { transformer } = require(transformerPath);

  const { tokens } = parse(code);

  return stringify(transformer(tokens, transformerOptions));
}
