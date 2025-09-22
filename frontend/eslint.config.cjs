const js = require('@eslint/js');
const tsEslintPlugin = require('@typescript-eslint/eslint-plugin');
const tsEslintParser = require('@typescript-eslint/parser');
const reactHooks = require('eslint-plugin-react-hooks');

module.exports = [
  {
    ignores: ['dist', 'node_modules'],
  },
  {
    files: ['babel.config.js'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'script',
      globals: require('globals').node,
    },
  },
  {
    files: ['**/*.{js,ts,tsx}'],
    languageOptions: {
      parser: tsEslintParser,
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
      '@typescript-eslint': tsEslintPlugin,
      'react-hooks': reactHooks,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...tsEslintPlugin.configs.recommended.rules,
      ...reactHooks.configs['recommended-latest'].rules,
    },
  },
];