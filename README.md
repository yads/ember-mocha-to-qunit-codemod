# ember-mocha-to-qunit-codemod

This codemod is intended to automatically update your test files from mocha to qunit.

## Usage

To run a specific codemod from this project, you would run the following:

```
npx ember-mocha-to-qunit-codemod <TRANSFORM NAME> path/of/files/ or/some**/*glob.js

# or

yarn global add ember-mocha-to-qunit-codemod
ember-mocha-to-qunit-codemod <TRANSFORM NAME> path/of/files/ or/some**/*glob.js
```

## Local Usage
```
node ./bin/cli.js <TRANSFORM NAME> path/of/files/ or/some**/*glob.js
```

## Transforms

<!--TRANSFORMS_START-->
* [convert-tests](transforms/convert-tests/README.md)
<!--TRANSFORMS_END-->

## Contributing

### Installation

* clone the repo
* change into the repo directory
* `yarn`

### Running tests

* `yarn test`

### Update Documentation

* `yarn update-docs`
