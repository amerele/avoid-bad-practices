import * as vscode from 'vscode';
import { Rule } from './rule';

// Flags two or more consecutive independent awaits — wrap them in Promise.all

const REASON = 'Sequential awaits — wrap independent async calls in Promise.all() or Promise.allSettled()';
const AWAIT_KEYWORD = 'await';
const AWAIT_PATTERN = /\bawait\b/;
const PROMISE_ALL_PATTERN = /Promise\.(all|allSettled)\s*\(/;
const MAX_LINE_GAP = 2;
const NO_PREVIOUS_AWAIT = -1;

export const noSequentialAwaits: Rule = {
  id: 'no-sequential-awaits',
  description: REASON,
  languages: ['javascript', 'typescript', 'javascriptreact', 'typescriptreact'],
  defaultSeverity: 'warning',

  check(doc) {
    const diagnostics: vscode.Diagnostic[] = [];
    const lines = doc.getText().split('\n');

    let lastAwaitLine = NO_PREVIOUS_AWAIT;

    lines.forEach((line: string, i: number) => {
      if (line.trimStart().startsWith('//')) { return; }

      if (PROMISE_ALL_PATTERN.test(line)) {
        lastAwaitLine = NO_PREVIOUS_AWAIT;
        return;
      }

      if (!AWAIT_PATTERN.test(line)) { return; }

      if (lastAwaitLine !== NO_PREVIOUS_AWAIT && i - lastAwaitLine <= MAX_LINE_GAP) {
        const col = line.indexOf(AWAIT_KEYWORD);
        const range = new vscode.Range(i, col, i, col + AWAIT_KEYWORD.length);
        diagnostics.push(new vscode.Diagnostic(range, REASON, vscode.DiagnosticSeverity.Warning));
      }

      lastAwaitLine = i;
    });

    return diagnostics;
  }
};
