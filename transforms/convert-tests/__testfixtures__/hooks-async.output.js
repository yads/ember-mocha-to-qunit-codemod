import { module } from 'qunit';

module('describe', hooks => {
  let x = 'describe';

  hooks.beforeEach(async function() {
    x = 'beforeEach';
  });

  hooks.beforeEach(function(assert) {
    const done = assert.async();
    x = 'beforeEach';
    done();
  });

  hooks.afterEach(async function() {
    x = 'afterEach';
  });

  hooks.afterEach(function(assert) {
    const done = assert.async();
    x = 'afterEach';
    done();
  });

  hooks.before(async function() {
    x = 'before';
  });

  hooks.before(function(assert) {
    const done = assert.async();
    x = 'before';
    done();
  });

  hooks.after(async function() {
    x = 'after';
  });

  hooks.after(function(assert) {
    const done = assert.async();
    x = 'after';
    done();
  });
});
