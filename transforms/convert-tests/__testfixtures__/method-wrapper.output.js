import { module, test } from 'qunit';

function wrap(func) {
  return function() {
    hooks.beforeEach(function() {
      let x = 'beforeEach';
    });

    func();

    hooks.afterEach(function() {
      let x = 'afterEach';
    });
  };
}

module('desc', wrap(function() {
  test('test', function(assert) {
    //ember-mocha-to-qunit-codemod: migrated from mocha, consider using qunit assertions instead
    assert.expect(0);

    let x = 'test';
  });
}));
