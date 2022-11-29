'use strict';

const { runTransformTest } = require('codemod-cli');

// suppress transform warnings during test
console.warn = () => {};

runTransformTest({
  name: 'mocha-to-qunit',
  path: require.resolve('./index.js'),
  fixtureDir: `${__dirname}/__testfixtures__/`,
});
