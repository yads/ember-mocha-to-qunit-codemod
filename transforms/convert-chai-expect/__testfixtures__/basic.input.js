import { expect } from 'chai';
import { find, findAll } from '@ember/test-helpers';
import { module, test } from 'qunit';

module('mod', hooks => {
  hooks.beforeEach(function() {
    expect(true).to.be.true;
  });

  hooks.afterEach(function() {
    expect(true).to.be.true;
  });

  hooks.before(function() {
    expect(true).to.be.true;
  });

  hooks.after(function() {
    expect(true).to.be.true;
  });

  test('test', function(assert) {
    //ember-mocha-to-qunit-codemod: migrated from mocha, consider using qunit assertions instead
    assert.expect(0);

    // Simple true validation
    expect(true).to.be.true;
    expect(true, 'expect with message').to.be.true;
    expect('Test').to.be.ok;
    expect('Test', 'With message').to.be.ok;
    expect('Test').to.be.present;
    expect('Test', 'With message').to.be.present;

    // Simple false validation
    expect(false).to.be.false;
    expect(false, 'expect with message').to.be.false;

    // Negative cases with variance
    expect(result).to.be.empty;
    expect(result, 'With Message').to.be.empty;
    expect(undefined).to.be.undefined;

    // Variations in equal assertion
    expect(true).to.equal(true);
    expect(true).to.equals(true);
    expect(true).to.eq(true);
    expect(find('[data-test-id=page-title]').innerText.trim(), '[Message] Expression with message').to.equal('[Expected] Page Title');
    expect(window.location.pathname).to.be.equal('/support/login');
    expect({key: value}).to.eql({key: value});
    expect({key: value}, 'Assertion Message').to.eql({key: value});
    expect({key: value}).to.deep.equal({key: value});
    expect({key: value}).to.not.deep.equal({key: some_other_value});
  });

  test('basic negative expect statements', async function() {
    expect(false).to.not.be.true;
    expect(false, 'Message').to.not.be.true;
    expect(true).to.not.be.false;
    expect(true, 'Message').to.not.be.false;
    expect(1).to.not.equal(2);
    await expect(1, 'Message').to.not.equal(2);

    expect('Test', 'Message').to.not.be.ok;
    expect('Test', 'not empty assertion').to.not.be.empty;
  });

  // 'expected-contains'
  test('Contains expects expected-contains', function() {
    expect('Message has input').to.be.contains('input');
    expect([1, 2]).to.be.contain(2);
    expect('Message has input', 'Assertions Message').to.have.contain('input');
    expect('Message has input').to.be.contain('input');
    expect('Message has input').to.contains('input');

    expect('Message has input').to.be.include('input');
    expect('Message has input').to.includes('input');
    expect([1, 2]).to.be.include(2);
    expect([1, 2]).to.be.includes(2);
    expect('Message has input').to.have.string('input');
    expect(i.name).to.be.oneOf(['name', 'customFields.custom_company_text_field']);
    // Should handle this edge cases
    // expect(options).to.be.an('array').to.not.include(serviceTaskType);
    // Not contains
    expect('Message').to.not.contain('input');
    expect('Message', 'Assertions Message').to.not.contains('input');
    expect('Message').to.not.include('input');
    expect('Message', 'Assertions Message').to.not.includes('input');
    expect('Message').to.not.have.string('input');
  });

  // expected-closeto
  test('Contains expects expected-match', function() {
    expect(165, 'check whether the given number exists within the provided delta').to.be.closeTo(168, 3);
    expect(2.5).to.be.closeTo(2, 0.5);
    expect(165, 'check whether the given number exists within the provided delta').to.not.be.closeTo(1, 3);
    expect(2.5).not.to.be.closeTo(10, 0.5);
  });

  // expected-match
  test('Contains expects expected-match', function() {
    expect('Message-1234-message', 'String should match the regex').to.be.match(/[a-zA-Z]+-\d+-[a-zA-Z]/);
    expect('1234-message', 'String should not match the regex').to.not.match(/[a-zA-Z]+-\d+-[a-zA-Z]/);
  });

  // 'expected-null'
  test('Contains expects expected-null', function() {
    expect('Has Value', 'message').to.not.be.null;
    expect(['Has Value'], 'message').to.be.null;
    expect(subject.get('ticket.customFields.nested_field_item')).to.be.nil;
  });

  // 'expected-exists'
  test('Contains expects expected-exists', function() {
    let refrence = 'Some Value';
    expect('Value').to.exist;
    expect(['Has Value'], 'message').to.exist;
    expect(refrence, 'message').to.exist;
    expect(refrence, 'message').not.to.exist;
  });

  // compare assertions
  test('Contains expects lt, lte, below, gt, gte, above', function() {
    expect(1).to.be.below(2);
    expect(2, 'assert message').to.be.lt(3);
    expect(2).to.be.lte(2);

    expect(1).to.be.above(2);
    expect(2, 'assert message').to.be.gt(3);
    expect(2).to.be.gte(2);
    expect(findAll('.ember-power-select-option').length).to.be.at.least(1);
  });

  // Throws
  test('Contains expects throw', function() {
    expect(result).to.throw();
    expect(result).to.throw(CustomError);
    expect(result).to.throw(TypeError, 'x');
    expect(result).to.throw(TypeError, /x/);
    expect(result).to.throw(TypeError, 'x', 'Assertion Message');
    expect(result, 'Assertion Message').to.throw();
  });

  // test.each handled correctly
  const testTable = [[true, true]];
  test.each('Contains table', testTable, function(assert, [value, expected]) {
    expect(value).to.eq(expected);
  });
});
