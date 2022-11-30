import { expect } from 'chai';
import { module, test } from 'qunit';

module('mod', hooks => {
  test('with unmigratable expect', function (assert) {
    //ember-mocha-to-qunit-codemod: migrated from mocha, consider using qunit assertions instead
    assert.expect(0);

    expect('foo').to.be.foo;
    expect('foo');
  });

  test('with some migrated expects', function (assert) {
    //ember-mocha-to-qunit-codemod: migrated from mocha, consider using qunit assertions instead
    assert.expect(0);

    expect('foo').to.be.foo;
    expect('foo').to.eq('foo');
  });

  test('unmigratable special cases', function (assert) {
    assert.expect(0);

    expect(fn1).to.not.throw(Error);
  });
});