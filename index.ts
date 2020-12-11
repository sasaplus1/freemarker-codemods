import { promises as fs } from 'fs';

import { Parser } from 'freemarker-parser';
import { stringify } from 'freemarker-stringifier';

import type { IToken } from 'freemarker-parser/types/interface/Tokens';

export type Codemods = {
  filePath: string;
  parse: typeof parse;
};

type Transformer = (
  tokens: IToken[],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transformerOptions?: Record<string, any>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  codemods?: Codemods
) => IToken[];

type Params = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transformerOptions: any;
  transformerPath: string;
};

type Context = {
  filePath: string;
};

const parser = new Parser();
const parse = parser.parse.bind(parser);

export async function applyModifiedCode(
  filePath: string,
  params: Params
): Promise<void> {
  const code = await fs.readFile(filePath, 'utf8');
  const modifiedCode = transform(code, params, { filePath });

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

export function transform(
  code: string,
  params: Params,
  context: Context
): string {
  const { transformerPath, transformerOptions } = params;

  const {
    transformer
  }: // eslint-disable-next-line @typescript-eslint/no-var-requires
  { transformer: Transformer } = require(transformerPath);

  const { tokens } = parse(code);

  const codemods = { filePath: context.filePath, parse };

  return stringify(transformer(tokens, transformerOptions, codemods));
}
