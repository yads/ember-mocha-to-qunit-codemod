'use strict';

const {
  assertionInfo,
  hasQualifier,
  hasNotQualifier,
  stringToExpression,
  showWarnings,
  basicMatcher,
  basicMigration,
} = require('./utils');

module.exports = [
  // basic true false
  basicMigration(
    ['true', 'false'],
    (name, path) => {
      let hasNot = hasNotQualifier(path);
      if (name === 'true') {
        return hasNot ? 'false' : 'true';
      } else {
        return hasNot ? 'true' : 'false';
      }
    },
    true
  ),
  // empty, present
  basicMigration(
    ['ok', 'empty', 'exist', 'present', 'undefined', 'null', 'nil'],
    (name, path) => {
      let hasNot = hasNotQualifier(path);
      if (['ok', 'exist', 'present'].includes(name)) {
        return hasNot ? 'notOk' : 'ok';
      } else {
        return hasNot ? 'ok' : 'notOk';
      }
    },
    true
  ),

  // equal, eql, etc
  basicMigration(
    ['equal', 'eql', 'eq', 'equals'],
    (name, path) => {
      let hasNot = hasNotQualifier(path);
      if (['equal', 'eq', 'equals'].includes(name) && !hasQualifier(path, 'deep')) {
        return hasNot ? 'notStrictEqual' : 'strictEqual';
      } else {
        return hasNot ? 'notDeepEqual' : 'deepEqual';
      }
    },
    false
  ),

  // contains, includes, string
  basicMigration(
    ['contain', 'contains', 'include', 'includes', 'string', 'oneOf'],
    ['contains', 'notContains'],
    false,
    'qunitAssertionsExtras'
  ),

  // oneOf
  {
    matcher: basicMatcher('oneOf'),
    transform(path, j) {
      showWarnings('qunitAssertionsExtras');

      let args = path.value.arguments;
      let { callExpr, hasNot } = assertionInfo(path);

      let identifier = hasNot ? 'notContains' : 'contains';

      let array = j(callExpr).find(j.ArrayExpression);
      if (array.length === 0) {
        let loc = path.value.loc.start;
        console.warn(
          `Could not find an array for a 'oneOf' assertion at ${loc.line}:${loc.column}`
        );
        return;
      }

      j(callExpr).replaceWith(
        j.callExpression(stringToExpression(`assert.${identifier}`, j), [
          array.get().value,
          args[0],
          ...args.slice(1),
        ])
      );
    },
  },

  // closeTo
  basicMigration('closeTo', ['close', 'notClose'], false, 'qunitAssertClose'),

  // match
  basicMigration('match', ['match', 'notMatch'], false, 'qunitAssertionsExtras'),

  // lt, gt, least, most, etc
  basicMigration(
    [
      'lt',
      'lessThan',
      'below',
      'lte',
      'lessThanOrEqual',
      'most',
      'gt',
      'greaterThan',
      'above',
      'gte',
      'greaterThanOrEqual',
      'least',
    ],
    (name, path) => {
      let hasNot = hasNotQualifier(path);
      if (['lt', 'lessThan', 'below'].includes(name)) {
        return hasNot ? 'gte' : 'lt';
      }
      if (['lte', 'lessThanOrEqual', 'most'].includes(name)) {
        return hasNot ? 'gt' : 'lte';
      }
      if (['gt', 'greaterThan', 'above'].includes(name)) {
        return hasNot ? 'lte' : 'gt';
      }
      if (['gte', 'greaterThanOrEqual', 'least'].includes(name)) {
        return hasNot ? 'lt' : 'gte';
      }
    },
    false,
    'qunitAssertCompare'
  ),
  require('./dom'),
  require('./throws'),
];
