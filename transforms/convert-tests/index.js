const { getParser } = require('codemod-cli').jscodeshift;

const MOCHA_TO_QUNIT_MAP = {
  describe: 'module',
  context: 'module',
  it: 'test',
};

module.exports = function transformer(file, api) {
  const j = getParser(api);

  const root = j(file.source);

  function updateImports() {
    // replace all ember-mocha import with ember-qunit
    let emberMochaImports = root.find(j.ImportDeclaration, {
      source: { value: 'ember-mocha' },
    });

    const emberMochaSpecifiers = [];
    emberMochaImports.find(j.ImportSpecifier).forEach((p) => {
      emberMochaSpecifiers.push(p.node.imported.name);
    });
    emberMochaImports.forEach((p) => {
      p.get('source').replace("'ember-qunit'");
    });

    // replace all mocha imports with qunit
    let mochaImports = root.find(j.ImportDeclaration, {
      source: { value: 'mocha' },
    });

    const hookMethods = [];
    const qunitImports = new Set();

    if (mochaImports.size() > 0) {
      mochaImports
        .find(j.ImportSpecifier)
        .forEach((p) => {
          const importName = p.node.imported.name;
          const mappedName = MOCHA_TO_QUNIT_MAP[importName];

          if (mappedName) {
            qunitImports.add(mappedName);
          } else {
            // method does not have a global equivalent
            // e.g. beforeEach/afterEach should use hooks instead
            hookMethods.push(importName);
          }
        })
        .remove();

      let qunitImport = j.importDeclaration(
        Array.from(qunitImports)
          .sort()
          .map((s) => j.importSpecifier(j.identifier(s))),
        j.literal('qunit')
      );
      mochaImports.at(0).insertBefore(qunitImport);
      mochaImports.remove();
    }

    return {
      emberMochaSpecifiers,
      hookMethods,
    };
  }

  function updateEmberQunitMethods(methods) {
    // add hooks to the setupXTest call argument list
    // remove any assignment from this method
    methods.forEach((method) => {
      let hooksInVariableDeclarator = false;
      let hooksInAssignmentExpression = false;
      let qunitMethod = root
        .find(j.CallExpression, {
          callee: {
            name: method,
          },
        })
        .forEach((p) => {
          p.get('arguments').replace([j.identifier('hooks')]);
          // code has an expression like let hooks = setupTest()
          if (p.parent?.value?.type === 'VariableDeclarator') {
            hooksInVariableDeclarator = true;
          }
          if (p.parent?.value?.type === 'AssignmentExpression') {
            hooksInAssignmentExpression = true;
          }
        });
      if (hooksInVariableDeclarator) {
        qunitMethod
          .closest(j.VariableDeclaration)
          .replaceWith((p) => j.expressionStatement(p.get('declarations').value[0].init));
      }
      if (hooksInAssignmentExpression) {
        qunitMethod.closest(j.AssignmentExpression).replaceWith((p) => p.get('right').value);
      }
    });
  }

  function getNewTestMethod(funcNode, opts = {}) {
    opts.args = opts.args ?? [];
    const body = [...funcNode.body.body];

    // done argument
    if (funcNode.params.length === 1) {
      if (!opts.includeAssert) {
        opts.args.push(j.identifier('assert'));
      }

      body.unshift(
        j.variableDeclaration('const', [
          j.variableDeclarator(
            funcNode.params[0],
            j.callExpression(j.identifier('assert.async'), [])
          ),
        ])
      );
    }
    if (opts.includeAssert) {
      opts.args.push(j.identifier('assert'));
      let assertion = j.expressionStatement(
        j.memberExpression(
          j.identifier('assert'),
          j.callExpression(j.identifier('expect'), [j.literal(0)])
        )
      );
      assertion.comments = [
        j.commentLine(
          'ember-mocha-to-qunit-codemod: migrated from mocha, consider using qunit assertions instead'
        ),
      ];
      body.unshift(assertion);
    }

    const isAsync = funcNode.async;

    let retFunc;
    if (opts.arrow) {
      retFunc = j.arrowFunctionExpression(opts.args, j.blockStatement(body));
    } else {
      retFunc = j.functionExpression(null, opts.args, j.blockStatement(body));
    }
    retFunc.async = isAsync;

    return retFunc;
  }

  function nonStandardArgWarning(method, loc) {
    console.warn(
      `${file.path}:${loc.get('start').value.line}:${
        loc.get('start').value.column
      } Encountered a non standard argument passed to '${method}'`
    );
    console.warn('You will need to manually update this test');
  }

  function updateHookMethods(methods) {
    methods.forEach((method) => {
      root
        .find(j.CallExpression, {
          callee: {
            name: method,
          },
        })
        .forEach((p) => {
          p.get('callee').replace(j.identifier(`hooks.${method}`));
          const args = p.get('arguments');
          let func = args.value[0];

          if (func.type !== 'FunctionExpression') {
            return nonStandardArgWarning(method, p.get('loc'));
          }

          args.value[0] = getNewTestMethod(func);
        });
    });
  }

  function updateMochaMethods() {
    // convert describe and context into module with arrow function
    ['describe', 'context'].forEach((type) => {
      root
        .find(j.CallExpression, {
          callee: {
            name: type,
          },
        })
        .forEach((p) => {
          p.get('callee').replace(j.identifier('module'));
          const args = p.get('arguments');
          let func = args.value[1];

          if (func.type !== 'FunctionExpression') {
            return nonStandardArgWarning(type, p.get('loc'));
          }

          // module method is safe to be an arrow function because `this` is not supported
          // in this method in mocha
          args.value[1] = getNewTestMethod(func, {
            args: [j.identifier('hooks')],
            arrow: true,
          });
        });
    });

    // convert it tests into qunit tests with arrow function
    root
      .find(j.CallExpression, {
        callee: {
          name: 'it',
        },
      })
      .forEach((p) => {
        p.get('callee').replace(j.identifier('test'));
        const args = p.get('arguments');
        let func = args.value[1];

        if (func.type !== 'FunctionExpression') {
          return nonStandardArgWarning('it', p.get('loc'));
        }

        args.value[1] = getNewTestMethod(func, {
          includeAssert: true,
        });
      });

    // update this.timeout calls
    root
      .find(j.MemberExpression, {
        object: {
          type: 'ThisExpression',
        },
        property: {
          name: 'timeout',
        },
      })
      .forEach((p) => {
        p.get('object').replace(j.identifier('assert'));
      });
  }

  const importResult = updateImports();
  updateEmberQunitMethods(importResult.emberMochaSpecifiers);
  updateHookMethods(importResult.hookMethods);
  updateMochaMethods();

  const printOptions = { quote: 'single', wrapColumn: 100 };

  return root.toSource(printOptions);
};

module.exports.type = 'js';
