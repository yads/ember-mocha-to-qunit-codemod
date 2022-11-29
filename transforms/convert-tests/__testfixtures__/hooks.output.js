import { module } from 'qunit';

module('describe', hooks => {
  let x = 'describe';

  module('context', hooks => {
    x = 'context';

    hooks.beforeEach(function() {
      x = 'beforeEach';
    });

    hooks.afterEach(function() {
      x = 'afterEach';
    });

    hooks.before(function() {
      x = 'before';
    });

    hooks.after(function() {
      x = 'after';
    });
  });
});
