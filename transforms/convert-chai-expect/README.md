# convert-chai-expect


## Usage

```
npx ember-mocha-to-qunit-codemod convert-chai-expect path/of/files/ or/some**/*glob.js

# or

yarn global add ember-mocha-to-qunit-codemod
ember-mocha-to-qunit-codemod convert-chai-expect path/of/files/ or/some**/*glob.js
```

## Local Usage
```
node ./bin/cli.js convert-chai-expect path/of/files/ or/some**/*glob.js
```

## Caveats
* Only migrates `expect` style assertions. Does not support `should` or `assert` style.
* Not all assertions are supported. Unsupported assertions will not be migrated.
* Supports assertions from the following chai plugins:
  * [chai-dom](https://www.npmjs.com/package/chai-dom)
  * [sinon-chai](https://www.npmjs.com/package/sinon-chai)
* Some assertions require third party qunit plugins. These include:
  * [qunit-assertions-extras](https://www.npmjs.com/package/qunit-assertions-extra)
  * [qunit-assert-close](https://www.npmjs.com/package/qunit-assert-close)
  * [qunit-assert-compare](https://www.npmjs.com/package/qunit-assert-compare)
  * [qunit-dom](https://npmjs.com/package/qunit-dom)
* If a migration results in assertions listed above a warning message will be displayed.
Ensure you add any required plugins to your project.

## Input / Output

<!--FIXTURES_TOC_START-->
* [basic](#basic)
* [dom](#dom)
* [unmigratable](#unmigratable)
<!--FIXTURES_TOC_END-->

<!--FIXTURES_CONTENT_START-->
---
<a id="basic">**basic**</a>

**Input** (<small>[basic.input.js](transforms/convert-chai-expect/__testfixtures__/basic.input.js)</small>):
```js
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

```

**Output** (<small>[basic.output.js](transforms/convert-chai-expect/__testfixtures__/basic.output.js)</small>):
```js
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
    assert.match('Message-1234-message', /[a-zA-Z]+-\d+-[a-zA-Z]/, 'String should match the regex');
    assert.notMatch('1234-message', /[a-zA-Z]+-\d+-[a-zA-Z]/, 'String should not match the regex');
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

```
---
<a id="dom">**dom**</a>

**Input** (<small>[dom.input.js](transforms/convert-chai-expect/__testfixtures__/dom.input.js)</small>):
```js
import { expect } from 'chai';
import { find, findAll } from '@ember/test-helpers';
import { module, test } from 'qunit';

module('mod', hooks => {
  test('expects various dom specific assertions', function() {
    expect(find('[data-test-id=page-title]')).to.have.attr('href', 'link');
    expect(find('[data-test-id=page-title]'), 'Assertion Message').to.have.attribute('aria-label', 'label');
    expect(find('[data-test-id=page-title]')).to.have.attribute('disabled');
    expect(find('[data-test-id=page-title]')).to.have.class('text--bold');
    expect(findAll('[data-test-id=page-title]')[1]).to.have.class('text--bold');

    expect(find('[data-test-id=page-title]')).to.be.checked;
    expect(find('[data-test-id=page-title]'), 'Assertion Message').to.be.visible;
    expect(find('[data-test-id=page-title]'), 'Assertion Message').to.have.text('input');
    expect(find('[data-test-id=page-title]')).to.have.trimmed.text('input');
    expect(find('[data-test-id=page-title]')).to.contain.text('input');
    expect(find('[data-test-id=page-title]'),'Assertion Message').to.contain.trimmed.text('input');
    expect(find('[data-test-id=page-title]')).to.have.value('input');
    expect(pageTitleSelector).to.have.attr('href', 'link');
    expect(pageTitleSelector).to.have.focus;
    expect(pageTitleSelector, 'Assertion Message').to.have.text(inputVariable);

    expect(find('[data-test-id=page-title]'), 'Assertion Message').to.not.have.attr('disabled');
    expect(find('[data-test-id=page-title]')).to.not.have.focus;
    expect(find('[data-test-id=page-title]')).to.not.be.visible;

    expect(find('[data-test-id=page-title]')).to.have.style('borderWidth', '3px');
    expect(find('[data-test-id=page-title]'), 'Assertion Message').to.not.have.style('borderWidth', '3px');
  });

  test('expects various dom specific assertions with document.querySelector', function() {
    expect(document.querySelector('[data-test-id=page-title]')).to.have.attr('href', 'link');
    expect(document.querySelector('[data-test-id=page-title]'), 'Assertion Message').to.have.attribute('aria-label', 'label');
    expect(document.querySelector('[data-test-id=page-title]')).to.have.attribute('disabled');
    expect(document.querySelector('[data-test-id=page-title]')).to.have.class('text--bold');
    expect(document.querySelectorAll('[data-test-id=page-title]')[1]).to.have.class('text--bold');

    expect(document.querySelector('[data-test-id=page-title]')).to.be.checked;
    expect(document.querySelector('[data-test-id=page-title]'), 'Assertion Message').to.be.visible;
    expect(document.querySelector('[data-test-id=page-title]'), 'Assertion Message').to.have.text('input');
    expect(document.querySelector('[data-test-id=page-title]')).to.have.trimmed.text('input');
    expect(document.querySelector('[data-test-id=page-title]')).to.contain.text('input');
    expect(document.querySelector('[data-test-id=page-title]'),'Assertion Message').to.contain.trimmed.text('input');
    expect(document.querySelector('[data-test-id=page-title]')).to.have.value('input');
    expect(pageTitleSelector).to.have.attr('href', 'link');
    expect(pageTitleSelector).to.have.focus;
    expect(pageTitleSelector, 'Assertion Message').to.have.text(inputVariable);

    expect(document.querySelector('[data-test-id=page-title]'), 'Assertion Message').to.not.have.attr('disabled');
    expect(document.querySelector('[data-test-id=page-title]')).to.not.have.focus;
    expect(document.querySelector('[data-test-id=page-title]')).to.not.be.visible;

    expect(document.querySelector('[data-test-id=page-title]')).to.have.style('borderWidth', '3px');
    expect(document.querySelector('[data-test-id=page-title]'), 'Assertion Message').to.not.have.style('borderWidth', '3px');
  });
});

```

**Output** (<small>[dom.output.js](transforms/convert-chai-expect/__testfixtures__/dom.output.js)</small>):
```js
import { find, findAll } from '@ember/test-helpers';
import { module, test } from 'qunit';

module('mod', hooks => {
  test('expects various dom specific assertions', function(assert) {
    assert.dom('[data-test-id=page-title]').hasAttribute('href', 'link');
    assert.dom('[data-test-id=page-title]').hasAttribute('aria-label', 'label', 'Assertion Message');
    assert.dom('[data-test-id=page-title]').hasAttribute('disabled');
    assert.dom('[data-test-id=page-title]').hasClass('text--bold');
    assert.dom(findAll('[data-test-id=page-title]')[1]).hasClass('text--bold');

    assert.dom('[data-test-id=page-title]').isChecked();
    assert.dom('[data-test-id=page-title]').isVisible('Assertion Message');
    assert.dom('[data-test-id=page-title]').hasText('input', 'Assertion Message');
    assert.dom('[data-test-id=page-title]').hasText('input');
    assert.dom('[data-test-id=page-title]').hasText('input');
    assert.dom('[data-test-id=page-title]').hasText('input', 'Assertion Message');
    assert.dom('[data-test-id=page-title]').hasValue('input');
    assert.dom(pageTitleSelector).hasAttribute('href', 'link');
    assert.dom(pageTitleSelector).isFocused();
    assert.dom(pageTitleSelector).hasText(inputVariable, 'Assertion Message');

    assert.dom('[data-test-id=page-title]').doesNotHaveAttribute('disabled', 'Assertion Message');
    assert.dom('[data-test-id=page-title]').isNotFocused();
    assert.dom('[data-test-id=page-title]').isNotVisible();

    assert.dom('[data-test-id=page-title]').hasStyle({
      'borderWidth': '3px'
    });
    assert.dom('[data-test-id=page-title]').doesNotHaveStyle({
      'borderWidth': '3px'
    }, 'Assertion Message');
  });

  test('expects various dom specific assertions with document.querySelector', function(assert) {
    assert.dom('[data-test-id=page-title]').hasAttribute('href', 'link');
    assert.dom('[data-test-id=page-title]').hasAttribute('aria-label', 'label', 'Assertion Message');
    assert.dom('[data-test-id=page-title]').hasAttribute('disabled');
    assert.dom('[data-test-id=page-title]').hasClass('text--bold');
    assert.dom(document.querySelectorAll('[data-test-id=page-title]')[1]).hasClass('text--bold');

    assert.dom('[data-test-id=page-title]').isChecked();
    assert.dom('[data-test-id=page-title]').isVisible('Assertion Message');
    assert.dom('[data-test-id=page-title]').hasText('input', 'Assertion Message');
    assert.dom('[data-test-id=page-title]').hasText('input');
    assert.dom('[data-test-id=page-title]').hasText('input');
    assert.dom('[data-test-id=page-title]').hasText('input', 'Assertion Message');
    assert.dom('[data-test-id=page-title]').hasValue('input');
    assert.dom(pageTitleSelector).hasAttribute('href', 'link');
    assert.dom(pageTitleSelector).isFocused();
    assert.dom(pageTitleSelector).hasText(inputVariable, 'Assertion Message');

    assert.dom('[data-test-id=page-title]').doesNotHaveAttribute('disabled', 'Assertion Message');
    assert.dom('[data-test-id=page-title]').isNotFocused();
    assert.dom('[data-test-id=page-title]').isNotVisible();

    assert.dom('[data-test-id=page-title]').hasStyle({
      'borderWidth': '3px'
    });
    assert.dom('[data-test-id=page-title]').doesNotHaveStyle({
      'borderWidth': '3px'
    }, 'Assertion Message');
  });
});

```
---
<a id="unmigratable">**unmigratable**</a>

**Input** (<small>[unmigratable.input.js](transforms/convert-chai-expect/__testfixtures__/unmigratable.input.js)</small>):
```js
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

```

**Output** (<small>[unmigratable.output.js](transforms/convert-chai-expect/__testfixtures__/unmigratable.output.js)</small>):
```js
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

```
<!--FIXTURES_CONTENT_END-->
