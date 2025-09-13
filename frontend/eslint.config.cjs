const js = require('@eslint/js');
const ts = require('typescript-eslint');
const reactHooks = require('eslint-plugin-react-hooks');

module.exports = [
  {
    ignores: ['dist', 'node_modules'],
  },
  {
    files: ['**/*.{js,ts,tsx}'],
    languageOptions: {
      parser: ts.parsers['@typescript-eslint/parser'],
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...require('globals').browser,
        test: 'readonly',
        expect: 'readonly',
      },
    },
    plugins: {
      'react-hooks': reactHooks,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...ts.configs.recommended.rules,
      ...reactHooks.configs['recommended-latest'].rules,
    },
  },
];
