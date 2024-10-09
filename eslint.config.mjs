import js from '@eslint/js';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import regexpEslint from 'eslint-plugin-regexp';
import pluginSecurity from 'eslint-plugin-security';
import wcEslint from 'eslint-plugin-wc';

export default [
  // general ignores
  {
    ignores: ['**/*.d.ts', '**/*.min.*', 'dist/*', 'demo/*', 'Gruntfile.js', 'set-release.js', 'node_modules/', '.github/'],
  },
  // general rules
  js.configs.recommended,
  regexpEslint.configs['flat/recommended'],
  wcEslint.configs['flat/recommended'],
  prettierRecommended,
  pluginSecurity.configs.recommended,
  // overrides
  {
    files: ['**/*.{js,mjs,cjs}'],
    rules: {
      'prettier/prettier': 'error',
      'no-mixed-spaces-and-tabs': ['error', 'smart-tabs'],
      'no-undef': 'off',
      'no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
        },
      ],
    },
  },
];
