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

  extends: ['plugin:@typescript-eslint/recommended', 'plugin:nuxt/recommended', 'plugin:vue/vue3-recommended', 'plugin:prettier/recommended', 'plugin:tailwindcss/recommended'],

  plugins: ['@typescript-eslint', 'tailwindcss'],

  ignorePatterns: ['*.min.*', 'dist/*', '.output/*'],

  rules: {
    'vue/script-setup-no-uses-vars': 'off',
    'vue/multi-word-component-names': 'off',
    'tailwindcss/no-custom-classname': 'off',
    'vue/attribute-hyphenation': 'off',
    'vue/require-default-prop': 'off',
  },
};
