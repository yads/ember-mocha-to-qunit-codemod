'use strict';

function findLastMember(path) {
  let curPath = path;
  while (curPath.parent.value.type === 'MemberExpression') {
    curPath = curPath.parent;
  }
  return curPath;
}

function hasNotQualifier(path) {
  return hasQualifier(path, 'not');
}

function hasQualifier(path, qualifier) {
  let curPath = path;
  const identifiers = [];
  while (curPath.parent.value.type === 'MemberExpression') {
    if (curPath.parent.value.property.type === 'Identifier') {
      identifiers.push(curPath.parent.value.property.name);
    }
    curPath = curPath.parent;
  }
  return identifiers.includes(qualifier);
}

function stringToExpression(str, j) {
  let newNode = j(str).find(j.ExpressionStatement).get();
  return newNode.value.expression;
}

const warnings = require('./warnings');

function showWarnings(key) {
  if (!warnings[key] || warnings[key].shown) {
    return;
  }

  console.warn(warnings[key].message);
  warnings[key].shown = true;
}

function assertionInfo(path) {
  let lastMember = findLastMember(path);
  let callExpr = lastMember.parent;
  let property = lastMember.value.property;
  let hasNot = hasNotQualifier(path);
  return {
    lastMember,
    callExpr,
    property,
    hasNot,
  };
}

function basicMatcher(chai) {
  return function (path, j) {
    // ensure we're in a function that has an assert argument
    const func = j(path).closest(j.FunctionExpression);
    if (func.length === 0) {
      return false;
    }

    if (!func.get('params').value.some((p) => p.type === 'Identifier' && p.name === 'assert')) {
      return false;
    }

    let property = findLastMember(path).value.property;
    if (!Array.isArray(chai)) {
      chai = [chai];
    }
    return property?.type === 'Identifier' && chai.includes(property?.name);
  };
}

function basicMigration(chai, getIdentifier, isProp, warning = false) {
  return {
    matcher: basicMatcher(chai),
    transform(path, j) {
      if (warning) {
        showWarnings(warning);
      }
      let args = path.value.arguments;

      let { lastMember, property, callExpr, hasNot } = assertionInfo(path);

      let identifier;

      if (Array.isArray(getIdentifier)) {
        identifier = hasNot ? getIdentifier[1] : getIdentifier[0];
      } else {
        identifier = getIdentifier(property.name, path);
      }

      if (isProp) {
        j(lastMember).replaceWith(
          j.callExpression(stringToExpression(`assert.${identifier}`, j), args)
        );
      } else {
        j(callExpr).replaceWith(
          j.callExpression(stringToExpression(`assert.${identifier}`, j), [
            args[0],
            ...callExpr.value.arguments,
            ...args.slice(1),
          ])
        );
      }
    },
  };
}

module.exports = {
  assertionInfo,
  findLastMember,
  hasQualifier,
  stringToExpression,
  showWarnings,
  basicMatcher,
  basicMigration,
  hasNotQualifier,
};
