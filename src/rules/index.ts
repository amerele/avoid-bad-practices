import { Rule } from './rule';
import { noMagicNumbers } from './no-magic-numbers';
import { noConsole } from './no-console';
import { noTodoComments } from './no-todo-comments';
import { deepNesting } from './no-deep-nesting';
import { noElse } from './no-else';
import { noAsyncInFor } from './no-async-in-for';
import { noSequentialAwaits } from './no-sequential-awaits';
import { noNestedArrayMethods } from './no-nested-array-methods';
import { noChainedFilters } from './no-chained-filters';

export const allRules: Rule[] = [
  noMagicNumbers,
  noConsole,
  noTodoComments,
  deepNesting,
  noElse,
  noAsyncInFor,
  noSequentialAwaits,
  noNestedArrayMethods,
  noChainedFilters,
];
