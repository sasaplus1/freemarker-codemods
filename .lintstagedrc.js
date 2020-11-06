module.exports = {
  '*.{js,ts}': 'eslint --cache --ext .js,.ts',
  'package.json': [
    'npx fixpack',
    'prettier --parser json-stringify --write',
    'git diff --exit-code --quiet'
  ],
  'package-lock.json': 'node -e "process.exitCode = 1;"'
};
