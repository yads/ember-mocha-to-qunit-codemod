module.exports = {
  parserOptions: {
    ecmaVersion: 2020,
  },

  plugins: ['prettier', 'node'],
  extends: ['eslint:recommended', 'plugin:prettier/recommended', 'plugin:node/recommended'],
  env: {
    node: true,
  },
  rules: {},
  overrides: [
    {
      files: ['__testfixtures__/**/*.js'],
      env: {
        jest: true,
      },
    },
  ],
};
