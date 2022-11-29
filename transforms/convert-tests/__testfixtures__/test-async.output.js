import { module, test } from 'qunit';

module('describe', hooks => {
  test('test 1', async function(assert) {
    //ember-mocha-to-qunit-codemod: migrated from mocha, consider using qunit assertions instead
    assert.expect(0);

    if (1 === 3) {
      throw new Error()
    }
  });

  test('test 2', function(assert) {
    //ember-mocha-to-qunit-codemod: migrated from mocha, consider using qunit assertions instead
    assert.expect(0);

    const done = assert.async();
    if (1 === 3) {
      throw new Error()
    }

    done();
  });
});
