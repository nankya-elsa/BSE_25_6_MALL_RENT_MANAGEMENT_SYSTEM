const js = require('@eslint/js');
const reactHooks = require('eslint-plugin-react-hooks');
const globals = require('globals');

module.exports = [
  {
    ignores: ['dist', 'node_modules'],
  },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.browser,
        test: 'readonly',
        expect: 'readonly',
      },
    },
    plugins: {
      'react-hooks': reactHooks,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs['recommended-latest'].rules,
    },
  },
  {
    // Node files (utils, tests)
    files: ['src/utils/**/*.js', 'tests/**/*.js', 'frontend/**/*.test.js', 'unit.test.js'],
    languageOptions: {
      globals: {
        ...globals.node,  // allow 'require' and 'module'
        test: 'readonly',
        expect: 'readonly',
      },
    },
  },
];
