'use strict';

const {
  assertionInfo,
  showWarnings,
  basicMatcher,
  stringToExpression,
  findLastMember,
  hasNotQualifier,
} = require('./utils');
const { getOptions } = require('codemod-cli');

const useIncludeText = getOptions().includeText;

function getDomArgs(args) {
  let firstArg = args[0];

  if (firstArg?.type === 'CallExpression' && firstArg?.callee?.name === 'find') {
    return firstArg.arguments;
  }

  if (firstArg?.type === 'CallExpression') {
    const callee = firstArg?.callee;

    // if document.querySelector or this.element.querySelector
    if (callee?.property.name === 'querySelector' && callee?.object?.name === 'document') {
      return firstArg.arguments;
    }
  }

  return [firstArg];
}
module.exports = {
  matcher: basicMatcher([
    'attr',
    'attribute',
    'class',
    'text',
    'value',
    'visible',
    'style',
    'focus',
    'checked',
  ]),
  transform(path, j) {
    showWarnings('qunitDom');

    let args = path.value.arguments;

    let { lastMember, property, callExpr, hasNot } = assertionInfo(path);

    let dom = j.callExpression(stringToExpression('assert.dom', j), getDomArgs(args));

    let identifier;
    if (['visible', 'checked', 'focus'].includes(property.name)) {
      if (property.name === 'visible') {
        identifier = hasNot ? 'isNotVisible' : 'isVisible';
      }
      if (property.name === 'checked') {
        identifier = hasNot ? 'isNotChecked' : 'isChecked';
      }
      if (property.name === 'focus') {
        identifier = hasNot ? 'isNotFocused' : 'isFocused';
      }
      j(lastMember).replaceWith(
        j.memberExpression(dom, j.callExpression(j.identifier(identifier), args.slice(1)))
      );
    } else if (property.name === 'style') {
      identifier = hasNot ? 'doesNotHaveStyle' : 'hasStyle';
      let styleArgs = [
        j.objectExpression([
          j.property('init', callExpr.value.arguments[0], callExpr.value.arguments[1]),
        ]),
      ];

      j(callExpr).replaceWith(
        j.memberExpression(
          dom,
          j.callExpression(j.identifier(identifier), [...styleArgs, ...args.slice(1)])
        )
      );
    } else if (property.name === 'attr' || property.name === 'attribute') {
      // special case of attribute expectation chaining
      // e.g. .attribute('href').eq('link')
      if (callExpr.parent.value.type === 'MemberExpression') {
        // treat it like another layer of expectation
        let attrLastMember = findLastMember(callExpr);
        if (
          ['eq', 'equal', 'equals', 'eql', 'match'].includes(attrLastMember.value.property.name) &&
          attrLastMember.parent.value.type === 'CallExpression'
        ) {
          identifier = hasNotQualifier(callExpr) ? 'doesNotHaveAttribute' : 'hasAttribute';
          j(attrLastMember.parent).replaceWith(
            j.memberExpression(
              dom,
              j.callExpression(j.identifier(identifier), [
                ...callExpr.value.arguments,
                ...attrLastMember.parent.value.arguments,
                ...args.slice(1),
              ])
            )
          );
        }
      } else {
        identifier = hasNot ? 'doesNotHaveAttribute' : 'hasAttribute';
        j(callExpr).replaceWith(
          j.memberExpression(
            dom,
            j.callExpression(j.identifier(identifier), [
              ...callExpr.value.arguments,
              ...args.slice(1),
            ])
          )
        );
      }
    } else {
      if (property.name === 'class') {
        identifier = hasNot ? 'doesNotHaveClass' : 'hasClass';
      }
      if (property.name === 'text') {
        if (useIncludeText) {
          identifier = hasNot ? 'doesNotIncludeText' : 'includesText';
        } else {
          identifier = hasNot ? 'doesNotHaveText' : 'hasText';
        }
      }
      if (property.name === 'value') {
        identifier = hasNot ? 'doesNotHaveValue' : 'hasValue';
      }

      j(callExpr).replaceWith(
        j.memberExpression(
          dom,
          j.callExpression(j.identifier(identifier), [
            ...callExpr.value.arguments,
            ...args.slice(1),
          ])
        )
      );
    }
  },
};
