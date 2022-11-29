import { module, test } from 'qunit';

module('describe', hooks => {
  test('test', function(assert) {
    //ember-mocha-to-qunit-codemod: migrated from mocha, consider using qunit assertions instead
    assert.expect(0);

    if (1 === 3) {
      throw new Error()
    }
  });
});
