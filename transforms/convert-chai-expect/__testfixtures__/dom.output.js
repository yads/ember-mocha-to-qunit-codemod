import { find, findAll } from '@ember/test-helpers';
import { module, test } from 'qunit';

module('mod', hooks => {
  test('expects various dom specific assertions', function(assert) {
    assert.dom('[data-test-id=page-title]').hasAttribute('href', 'link');
    assert.dom('[data-test-id=page-title]').hasAttribute('aria-label', 'label', 'Assertion Message');
    assert.dom('[data-test-id=page-title]').hasAttribute('disabled');
    assert.dom('[data-test-id=page-title]').hasAttribute('href', 'link');
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
    assert.dom('[data-test-id=page-title]').hasAttribute('href', 'link');
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
    assert.dom(pageTitleSelector.querySelector('span')).isVisible();

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
