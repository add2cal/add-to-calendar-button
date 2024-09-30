import withNuxt from './.nuxt/eslint.config.mjs';

import tseslint from 'typescript-eslint';
import vueParser from 'vue-eslint-parser';
import prettierRecommended from 'eslint-plugin-prettier/recommended';

export default withNuxt([
  prettierRecommended,
  {
    files: ['**/*.js', '**/*.ts', '**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tseslint.parser,
        sourceType: 'module',
      },
    },
    rules: {
      'prettier/prettier': 'error',
      'tailwindcss/no-custom-classname': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-dynamic-delete': 'off',
      'vue/script-setup-no-uses-vars': 'off',
      'vue/multi-word-component-names': 'off',
      'vue/attribute-hyphenation': 'off',
      'vue/require-default-prop': 'off',
      'vue/no-setup-props-destructure': 'off',
      'vue/no-multiple-template-root': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { caughtErrors: 'none', argsIgnorePattern: '^_', destructuredArrayIgnorePattern: '^_' }],
    },
  },
])
  .override('nuxt/vue/rules', {
    rules: {
      'vue/no-v-html': 'off',
    },
  })
  .override('nuxt/typescript/rules', {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  });
