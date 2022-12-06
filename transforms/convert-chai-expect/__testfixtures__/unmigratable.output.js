import { expect } from 'chai';
import chai from 'chai';
import { module, test } from 'qunit';

module('mod', hooks => {
  function myTest() {
    expect(true).to.be.true;
  }

  test('with unmigratable expect', function (assert) {
    //ember-mocha-to-qunit-codemod: migrated from mocha, consider using qunit assertions instead
    assert.expect(0);

    expect('foo').to.be.foo;
    expect('foo');
  });

  test('with some migrated expects', function (assert) {
    expect('foo').to.be.foo;
    assert.strictEqual('foo', 'foo');
  });

  test('unmigratable special cases', function (assert) {
    assert.expect(0);

    expect(fn1).to.not.throw(Error);
  });
});
