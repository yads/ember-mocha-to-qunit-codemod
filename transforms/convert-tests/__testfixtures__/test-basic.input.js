import { it, describe } from 'mocha';

describe('describe', function() {
  it('test', function() {
    if (1 === 3) {
      throw new Error()
    }
  });
});
