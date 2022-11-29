import { it, describe, beforeEach, afterEach } from 'mocha';

function wrap(func) {
  return function() {
    beforeEach(function() {
      let x = 'beforeEach';
    });

    func();

    afterEach(function() {
      let x = 'afterEach';
    });
  };
}

describe('desc', wrap(function() {
  it('test', function() {
    let x = 'test';
  });
}));
