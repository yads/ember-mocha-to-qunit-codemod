import { it, describe } from 'mocha';

describe('describe', function() {
  it('test 1', async function() {
    if (1 === 3) {
      throw new Error()
    }
  });

  it('test 2', function(done) {
    if (1 === 3) {
      throw new Error()
    }

    done();
  });
});
