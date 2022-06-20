//.eslintrc.js
module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module",
  },
  plugins: ["node", "unicorn", "prettier", "@typescript-eslint"],
  extends: [
    "eslint:recommended",
    "plugin:node/recommended",
    "plugin:unicorn/recommended",
    "plugin:prettier/recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
  ],
  env: {
    node: true,
  },
  rules: {
    "no-console": "error",
    "unicorn/no-array-reduce": "off",
    "prettier/prettier": "error",
    "@typescript-eslint/no-var-requires": "off",
    "node/no-unsupported-features/es-syntax": [
      "error",
      { ignores: ["modules"] },
    ],
  },
  settings: {
    node: {
      tryExtensions: [".js", ".json", ".node", ".ts"],
    },
  },
};