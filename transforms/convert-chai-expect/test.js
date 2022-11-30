'use strict';

const { runTransformTest } = require('codemod-cli');
// suppress transform warnings during test
console.warn = () => {};

runTransformTest({
  name: 'convert-chai',
  path: require.resolve('./index.js'),
  fixtureDir: `${__dirname}/__testfixtures__/`,
});
