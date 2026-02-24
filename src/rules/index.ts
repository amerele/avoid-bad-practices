import { Rule } from './rule';
import { noMagicNumbers } from './no-magic-numbers';
import { noConsole } from './no-console';
import { noTodoComments } from './no-todo-comments';
import { deepNesting } from './deep-nesting';

export const allRules: Rule[] = [
  noMagicNumbers,
  noConsole,
  noTodoComments,
  deepNesting,
];
