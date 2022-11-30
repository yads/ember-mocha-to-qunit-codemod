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
