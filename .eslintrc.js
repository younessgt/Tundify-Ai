/* eslint-disable linebreak-style */
module.exports = {
  env: {
    browser: true,

    es2021: true,

    jest: true,
  },

  extends: [
    "eslint:recommended",

    "plugin:react/recommended",

    "plugin:jest/recommended",
  ],

  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },

    ecmaVersion: 15,

    sourceType: "module",
  },

  plugins: ["react", "jest"],

  rules: {
    indent: ["error", 2],

    quotes: ["error", "double"],

    // semi: ["error", "never"],
    "linebreak-style": ["error", "windows"],

    "react/display-name": "off",

    "react/react-in-jsx-scope": "off",

    "jest/no-disabled-tests": "warn",

    "jest/no-focused-tests": "error",

    "jest/no-identical-title": "error",

    "jest/prefer-to-have-length": "warn",

    "jest/valid-expect": "error",
  },
};

