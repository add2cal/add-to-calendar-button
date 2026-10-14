import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import eslintConfigPrettier from 'eslint-config-prettier';
import regexpEslint from 'eslint-plugin-regexp';
import pluginSecurity from 'eslint-plugin-security';
import astroPlugin from 'eslint-plugin-astro';

export default [
  // general ignores
  {
    ignores: ['**/*.d.ts', '**/*.min.*', 'dist/', 'demo/', 'scripts/', 'node_modules/', '.github/', '.ai/', '.astro/'],
  },
  // general rules
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...astroPlugin.configs.recommended,
  regexpEslint.configs['flat/recommended'],
  prettierRecommended,
  pluginSecurity.configs.recommended,
  // turn off all ESLint rules that conflict with Prettier
  eslintConfigPrettier,
  // overrides
  {
    files: ['**/*.{js,mjs,cjs,ts}'],
    rules: {
      'prettier/prettier': 'error',
      'no-mixed-spaces-and-tabs': ['error', 'smart-tabs'],
      'no-undef': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
    },
  },
  {
    files: ['**/*.astro'],
    rules: {
      'prettier/prettier': 'off',
      'no-mixed-spaces-and-tabs': ['error', 'smart-tabs'],
      'no-undef': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
    },
  },
  // eslint-plugin-astro extracts inline <script> blocks from .astro files
  // into virtual `*.astro/*.ts` files. The JS/TS override above re-enables
  // prettier/prettier on them, which causes spurious parsing errors. Turn
  // it back off here (matching the astro plugin's own recommendation).
  {
    files: ['**/*.astro/*.{js,ts}'],
    rules: {
      'prettier/prettier': 'off',
    },
  },
  {
    files: ['**/*.{js,mjs,cjs}'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
];
