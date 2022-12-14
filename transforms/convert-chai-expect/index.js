const { getParser } = require('codemod-cli').jscodeshift;
const { getOptions } = require('codemod-cli');
const utils = require('./lib/utils');

function getMigrations() {
  const options = getOptions();

  const migrations = [...require('./lib/migrations')];
  if (options.customMigration) {
    let customMigrations;
    if (options.customMigration instanceof Array) {
      customMigrations = options.customMigration.map((m) => customMigration(m));
    } else {
      customMigrations = [customMigration(options.customMigration)];
    }
    migrations.push(...customMigrations);
  }

  return migrations;
}

function customMigration(file) {
  return require(file).create(utils);
}

module.exports = function transformer(file, api) {
  const j = getParser(api);

  const root = j(file.source);

  function removePlaceholderAssert() {
    root
      .find(j.CallExpression, {
        callee: {
          type: 'MemberExpression',
          object: {
            type: 'Identifier',
            name: 'assert',
          },
          property: {
            type: 'Identifier',
            name: 'expect',
          },
        },
      })
      .filter((path) => {
        const args = path.get('arguments').value;
        return args.length === 1 && args[0].value === 0;
      })
      .map((path) => path.parent)
      .filter((path) => {
        let comments = path.get('comments').value;
        return comments?.length === 1 && comments[0].value.match(/^ember-mocha-to-qunit-codemod/);
      })
      .forEach((path) => {
        let wrappedPath = j(path);
        let containingFunction = wrappedPath.closest(j.FunctionExpression);
        // keep placeholder if containing method has no other asserts
        let hasOtherAsserts =
          containingFunction.find(j.MemberExpression, {
            object: {
              type: 'Identifier',
              name: 'assert',
            },
          }).length > 1;
        if (hasOtherAsserts) {
          wrappedPath.remove();
        }
      });
  }

  function ensureAssert(path) {
    const func = j(path).closest(j.FunctionExpression);
    if (func.length === 0) {
      return;
    }

    const params = func.get('params').value;
    if (params.length < 1 || params[0].name !== 'assert') {
      params.unshift(j.identifier('assert'));
    }
  }

  function removeExpectImport() {
    root
      .find(j.ImportSpecifier, {
        local: { name: 'expect' },
      })
      .filter((p) => p.parent.value.source.value === 'chai')
      .remove();

    let chaiImports = root.find(j.ImportDeclaration, {
      source: { value: 'chai' },
    });
    if (
      chaiImports.find(j.ImportSpecifier).length === 0 &&
      chaiImports.find(j.ImportDefaultSpecifier).length === 0
    ) {
      chaiImports.remove();
    }
  }

  const expects = root
    .find(j.CallExpression, {
      callee: {
        name: 'expect',
      },
    })
    .forEach(ensureAssert);

  getMigrations().forEach(({ matcher, transform }) => {
    expects.forEach((path) => {
      if (matcher(path, j)) {
        transform(path, j);
      }
    });
  });

  if (
    root.find(j.CallExpression, {
      callee: {
        name: 'expect',
      },
    }).length === 0
  ) {
    removeExpectImport();
  }

  removePlaceholderAssert();

  const printOptions = { quote: 'single', wrapColumn: 100 };

  return root.toSource(printOptions);
};

module.exports.type = 'js';
