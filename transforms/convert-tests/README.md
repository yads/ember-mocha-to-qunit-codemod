# mocha-to-qunit


## Usage

```
npx ember-mocha-to-qunit-codemod mocha-to-qunit path/of/files/ or/some**/*glob.js

# or

yarn global add ember-mocha-to-qunit-codemod
ember-mocha-to-qunit-codemod mocha-to-qunit path/of/files/ or/some**/*glob.js
```

## Local Usage
```
node ./bin/cli.js mocha-to-qunit path/of/files/ or/some**/*glob.js
```

## Post execution steps
This codemod only updates js files. You will also need to update your package.json to uninstall
both `mocha` and `ember-mocha`, as well as any other related packages (e.g. `eslinput-plugin-mocha`).
Install `qunit`, `ember-qunit`, `qunit-dom`, and `eslint-plugin-qunit`. Update your
`tests/test-helper.js` and `tests/index.html` as per the output of `ember new`.

See [ember-cli/ember-new-output](https://github.com/ember-cli/ember-new-output/)

## Input / Output

<!--FIXTURES_TOC_START-->
* [ember-mocha-methods](#ember-mocha-methods)
* [hooks-async](#hooks-async)
* [hooks](#hooks)
* [method-wrapper](#method-wrapper)
* [test-async](#test-async)
* [test-basic](#test-basic)
<!--FIXTURES_TOC_END-->

<!--FIXTURES_CONTENT_START-->
---
<a id="ember-mocha-methods">**ember-mocha-methods**</a>

**Input** (<small>[ember-mocha-methods.input.js](transforms/convert-tests/__testfixtures__/ember-mocha-methods.input.js)</small>):
```js
import { setupTest, setupApplicationTest, setupRenderingTest } from 'ember-mocha';
import { describe } from 'mocha';

describe('desc', function() {
  setupTest();
  setupApplicationTest();
  setupRenderingTest();
});

```

**Output** (<small>[ember-mocha-methods.output.js](transforms/convert-tests/__testfixtures__/ember-mocha-methods.output.js)</small>):
```js
import { setupTest, setupApplicationTest, setupRenderingTest } from 'ember-qunit';
import { module } from 'qunit';

module('desc', hooks => {
  setupTest(hooks);
  setupApplicationTest(hooks);
  setupRenderingTest(hooks);
});

```
---
<a id="hooks-async">**hooks-async**</a>

**Input** (<small>[hooks-async.input.js](transforms/convert-tests/__testfixtures__/hooks-async.input.js)</small>):
```js
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

```

**Output** (<small>[hooks-async.output.js](transforms/convert-tests/__testfixtures__/hooks-async.output.js)</small>):
```js
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

```
---
<a id="hooks">**hooks**</a>

**Input** (<small>[hooks.input.js](transforms/convert-tests/__testfixtures__/hooks.input.js)</small>):
```js
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

```

**Output** (<small>[hooks.output.js](transforms/convert-tests/__testfixtures__/hooks.output.js)</small>):
```js
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

```
---
<a id="method-wrapper">**method-wrapper**</a>

**Input** (<small>[method-wrapper.input.js](transforms/convert-tests/__testfixtures__/method-wrapper.input.js)</small>):
```js
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

```

**Output** (<small>[method-wrapper.output.js](transforms/convert-tests/__testfixtures__/method-wrapper.output.js)</small>):
```js
import { module, test } from 'qunit';

function wrap(func) {
  return function() {
    hooks.beforeEach(function() {
      let x = 'beforeEach';
    });

    func();

    hooks.afterEach(function() {
      let x = 'afterEach';
    });
  };
}

module('desc', wrap(function() {
  test('test', function(assert) {
    // Migrated from mocha, consider using qunit assertions instead
    assert.expect(0);

    let x = 'test';
  });
}));

```
---
<a id="test-async">**test-async**</a>

**Input** (<small>[test-async.input.js](transforms/convert-tests/__testfixtures__/test-async.input.js)</small>):
```js
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

```

**Output** (<small>[test-async.output.js](transforms/convert-tests/__testfixtures__/test-async.output.js)</small>):
```js
import { module, test } from 'qunit';

module('describe', hooks => {
  test('test 1', async function(assert) {
    // Migrated from mocha, consider using qunit assertions instead
    assert.expect(0);

    if (1 === 3) {
      throw new Error()
    }
  });

  test('test 2', function(assert) {
    // Migrated from mocha, consider using qunit assertions instead
    assert.expect(0);

    const done = assert.async();
    if (1 === 3) {
      throw new Error()
    }

    done();
  });
});

```
---
<a id="test-basic">**test-basic**</a>

**Input** (<small>[test-basic.input.js](transforms/convert-tests/__testfixtures__/test-basic.input.js)</small>):
```js
import { it, describe } from 'mocha';

describe('describe', function() {
  it('test', function() {
    if (1 === 3) {
      throw new Error()
    }
  });
});

```

**Output** (<small>[test-basic.output.js](transforms/convert-tests/__testfixtures__/test-basic.output.js)</small>):
```js
import { module, test } from 'qunit';

module('describe', hooks => {
  test('test', function(assert) {
    // Migrated from mocha, consider using qunit assertions instead
    assert.expect(0);

    if (1 === 3) {
      throw new Error()
    }
  });
});

```
<!--FIXTURES_CONTENT_END-->
