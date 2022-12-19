/* eslint-disable no-undef */
// prettier.config.js or .prettierrc.js
module.exports = {
  proseWrap: 'preserve',
  embeddedLanguageFormatting: 'off',
  useTabs: false,
  singleQuote: true,
  arrowParens: 'always',
  printWidth: 300,
  endOfLine: 'lf',
  plugins: [require('prettier-plugin-tailwindcss')],
};
