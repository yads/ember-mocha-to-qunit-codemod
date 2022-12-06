import { find, findAll } from '@ember/test-helpers';
import { module, test } from 'qunit';

module('mod', hooks => {
  hooks.beforeEach(function(assert) {
    assert.true(true);
  });

  hooks.afterEach(function(assert) {
    assert.true(true);
  });

  hooks.before(function(assert) {
    assert.true(true);
  });

  hooks.after(function(assert) {
    assert.true(true);
  });

  test('test', function(assert) {
    // Simple true validation
    assert.true(true);
    assert.true(true, 'expect with message');
    assert.ok('Test');
    assert.ok('Test', 'With message');
    assert.ok('Test');
    assert.ok('Test', 'With message');

    // Simple false validation
    assert.false(false);
    assert.false(false, 'expect with message');

    // Negative cases with variance
    assert.notOk(result);
    assert.notOk(result, 'With Message');
    assert.notOk(undefined);

    // Variations in equal assertion
    assert.strictEqual(true, true);
    assert.strictEqual(true, true);
    assert.strictEqual(true, true);
    assert.strictEqual(
      find('[data-test-id=page-title]').innerText.trim(),
      '[Expected] Page Title',
      '[Message] Expression with message'
    );
    assert.strictEqual(window.location.pathname, '/support/login');
    assert.deepEqual({key: value}, {key: value});
    assert.deepEqual({key: value}, {key: value}, 'Assertion Message');
    assert.deepEqual({key: value}, {key: value});
    assert.notDeepEqual({key: value}, {key: some_other_value});
  });

  test('basic negative expect statements', async function(assert) {
    assert.false(false);
    assert.false(false, 'Message');
    assert.true(true);
    assert.true(true, 'Message');
    assert.notStrictEqual(1, 2);
    await assert.notStrictEqual(1, 2, 'Message');

    assert.notOk('Test', 'Message');
    assert.ok('Test', 'not empty assertion');
  });

  // 'expected-contains'
  test('Contains expects expected-contains', function(assert) {
    assert.contains('Message has input', 'input');
    assert.contains([1, 2], 2);
    assert.contains('Message has input', 'input', 'Assertions Message');
    assert.contains('Message has input', 'input');
    assert.contains('Message has input', 'input');

    assert.contains('Message has input', 'input');
    assert.contains('Message has input', 'input');
    assert.contains([1, 2], 2);
    assert.contains([1, 2], 2);
    assert.contains('Message has input', 'input');
    assert.contains(['name', 'customFields.custom_company_text_field'], i.name);
    // Should handle this edge cases
    // expect(options).to.be.an('array').to.not.include(serviceTaskType);
    // Not contains
    assert.notContains('Message', 'input');
    assert.notContains('Message', 'input', 'Assertions Message');
    assert.notContains('Message', 'input');
    assert.notContains('Message', 'input', 'Assertions Message');
    assert.notContains('Message', 'input');
  });

  // expected-closeto
  test('Contains expects expected-match', function(assert) {
    assert.close(165, 168, 3, 'check whether the given number exists within the provided delta');
    assert.close(2.5, 2, 0.5);
    assert.notClose(165, 1, 3, 'check whether the given number exists within the provided delta');
    assert.notClose(2.5, 10, 0.5);
  });

  // expected-match
  test('Contains expects expected-match', function(assert) {
    assert.matches('Message-1234-message', /[a-zA-Z]+-\d+-[a-zA-Z]/, 'String should match the regex');
    assert.notMatches('1234-message', /[a-zA-Z]+-\d+-[a-zA-Z]/, 'String should not match the regex');
  });

  // 'expected-null'
  test('Contains expects expected-null', function(assert) {
    assert.ok('Has Value', 'message');
    assert.notOk(['Has Value'], 'message');
    assert.notOk(subject.get('ticket.customFields.nested_field_item'));
  });

  // 'expected-exists'
  test('Contains expects expected-exists', function(assert) {
    let refrence = 'Some Value';
    assert.ok('Value');
    assert.ok(['Has Value'], 'message');
    assert.ok(refrence, 'message');
    assert.notOk(refrence, 'message');
  });

  // compare assertions
  test('Contains expects lt, lte, below, gt, gte, above', function(assert) {
    assert.lt(1, 2);
    assert.lt(2, 3, 'assert message');
    assert.lte(2, 2);

    assert.gt(1, 2);
    assert.gt(2, 3, 'assert message');
    assert.gte(2, 2);
    assert.gte(findAll('.ember-power-select-option').length, 1);
  });

  // Throws
  test('Contains expects throw', function(assert) {
    assert.throws(result);
    assert.throws(result, CustomError);
    assert.throws(result, new TypeError('x'));
    assert.throws(result, /x/);
    assert.throws(result, new TypeError('x'), 'Assertion Message');
    assert.throws(result, 'Assertion Message');
  });

  // test.each handled correctly
  const testTable = [[true, true]];
  test.each('Contains table', testTable, function(assert, [value, expected]) {
    assert.strictEqual(value, expected);
  });
});
