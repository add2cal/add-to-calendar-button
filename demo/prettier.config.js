// prettier.config.js or .prettierrc.js
module.exports = {
  proseWrap: 'preserve',
  embeddedLanguageFormatting: 'off',
  useTabs: false,
  singleQuote: true,
  arrowParens: 'always',
  plugins: [require('prettier-plugin-tailwindcss')],
};
