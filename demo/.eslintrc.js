module.exports = {
  root: true,

  env: {
    browser: true,
    node: true,
    es2021: true,
  },

  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    parser: '@typescript-eslint/parser',
  },

  overrides: [
    {
      files: ['*.vue'],
      parser: 'vue-eslint-parser',
    },
  ],

  extends: ['plugin:@typescript-eslint/recommended', 'plugin:nuxt/recommended', 'plugin:vue/vue3-recommended', 'plugin:prettier/recommended'],

  plugins: ['@typescript-eslint', 'prettier'],

  ignorePatterns: ['*.min.*', 'dist/*', '.output/*'],

  rules: {
    'vue/script-setup-no-uses-vars': 'off',
    'vue/multi-word-component-names': 'off',
    'tailwindcss/no-custom-classname': 'off',
    'vue/attribute-hyphenation': 'off',
    'vue/require-default-prop': 'off',
  },
};
