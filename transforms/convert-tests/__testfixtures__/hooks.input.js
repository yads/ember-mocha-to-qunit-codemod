import { context, describe, before, after, beforeEach, afterEach } from 'mocha';

describe('describe', function() {
  let x = 'describe';

  context('context', function() {
    x = 'context';

    beforeEach(function() {
      x = 'beforeEach';
    });

    afterEach(function() {
      x = 'afterEach';
    });

    before(function() {
      x = 'before';
    });

    after(function() {
      x = 'after';
    });
  });
});
