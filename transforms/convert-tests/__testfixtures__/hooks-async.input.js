import { describe, before, after, beforeEach, afterEach } from 'mocha';

describe('describe', function() {
  let x = 'describe';

  beforeEach(async function() {
    x = 'beforeEach';
  });

  beforeEach(function(done) {
    x = 'beforeEach';
    done();
  });

  afterEach(async function() {
    x = 'afterEach';
  });

  afterEach(function(done) {
    x = 'afterEach';
    done();
  });

  before(async function() {
    x = 'before';
  });

  before(function(done) {
    x = 'before';
    done();
  });

  after(async function() {
    x = 'after';
  });

  after(function(done) {
    x = 'after';
    done();
  });
});
