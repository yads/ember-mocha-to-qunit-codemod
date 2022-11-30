'use strict';

const { assertionInfo, basicMatcher, stringToExpression } = require('./utils');

module.exports = {
  matcher: basicMatcher('throw'),
  transform(path, j) {
    let { callExpr, hasNot } = assertionInfo(path);

    if (hasNot) {
      return;
    }

    let throwsArgs = [path.value.arguments[0]];
    let error = callExpr.value.arguments[0];
    let errorMatcher = callExpr.value.arguments[1];
    let assertionMessage = callExpr.value.arguments[2] ?? path.value.arguments[1];

    if (error && errorMatcher) {
      if (typeof errorMatcher.value === 'string') {
        throwsArgs.push(stringToExpression(`new ${error.name}('${errorMatcher.value}')`, j));
      } else {
        throwsArgs.push(errorMatcher);
      }
    } else if (error) {
      throwsArgs.push(error);
    }

    if (assertionMessage) {
      throwsArgs.push(assertionMessage);
    }

    j(callExpr).replaceWith(j.callExpression(stringToExpression('assert.throws', j), throwsArgs));
  },
};
