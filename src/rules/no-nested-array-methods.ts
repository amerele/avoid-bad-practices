import * as vscode from 'vscode';
import { Rule } from './rule';

// Flags array method calls nested inside other array method callbacks

const REASON = 'Array method nested inside another — extract the inner logic to a named function';
const ARRAY_METHODS = ['map', 'filter', 'reduce', 'forEach', 'find', 'findIndex', 'some', 'every', 'flatMap'];
const METHOD_AT_DOT = new RegExp(`^\\.(${ARRAY_METHODS.join('|')})\\s*\\(`);

export const noNestedArrayMethods: Rule = {
  id: 'no-nested-array-methods',
  description: REASON,
  languages: ['javascript', 'typescript', 'javascriptreact', 'typescriptreact'],
  defaultSeverity: 'warning',

  check(doc) {
    const diagnostics: vscode.Diagnostic[] = [];
    const text = doc.getText();

    let parenDepth = 0;
    let lineIdx = 0;
    let lineStart = 0;
    const methodStack: number[] = [];
    let pendingPush = false;

    for (let i = 0; i < text.length; i++) {
      const ch = text[i];

      if (ch === '\n') {
        lineIdx++;
        lineStart = i + 1;
        continue;
      }

      if (ch === '(') {
        parenDepth++;
        if (pendingPush) {
          methodStack.push(parenDepth);
          pendingPush = false;
        }
      } else if (ch === ')') {
        parenDepth--;
        while (methodStack.length > 0 && methodStack[methodStack.length - 1] > parenDepth) {
          methodStack.pop();
        }
      } else if (ch === '.') {
        const match = METHOD_AT_DOT.exec(text.slice(i));
        if (match) {
          const colIdx = i - lineStart;
          if (methodStack.length > 0) {
            const range = new vscode.Range(lineIdx, colIdx + 1, lineIdx, colIdx + match[0].length - 1);
            diagnostics.push(new vscode.Diagnostic(range, REASON, vscode.DiagnosticSeverity.Warning));
          }
          pendingPush = true;
          i += match[0].length - 2;
        }
      }
    }

    return diagnostics;
  }
};
