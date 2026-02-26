import * as vscode from 'vscode';
import { Rule } from './rule';

// Flags await calls inside for/while/do loops

const REASON = 'Avoid await inside loops — use Promise.all() to run async calls in parallel';
const AWAIT_KEYWORD = 'await';
const LOOP_PATTERN = /\b(for|forEach|while|do)\b/;
const AWAIT_PATTERN = /\bawait\b/;

export const noAsyncInFor: Rule = {
  id: 'no-async-in-for',
  description: REASON,
  languages: ['javascript', 'typescript', 'javascriptreact', 'typescriptreact'],
  defaultSeverity: 'warning',

  check(doc) {
    const diagnostics: vscode.Diagnostic[] = [];
    const lines = doc.getText().split('\n');

    let braceDepth = 0;
    let loopDepths: number[] = [];

    lines.forEach((line: string, i: number) => {
      if (line.trimStart().startsWith('//')) { return; }

      const openCount = (line.match(/\{/g) ?? []).length;
      const closeCount = (line.match(/\}/g) ?? []).length;
      const isLoopLine = LOOP_PATTERN.test(line);

      braceDepth += openCount - closeCount;
      loopDepths = loopDepths.filter(d => d <= braceDepth);

      if (isLoopLine && openCount > closeCount) {
        loopDepths.push(braceDepth);
      }

      if (loopDepths.length === 0 || !AWAIT_PATTERN.test(line)) { return; }

      const col = line.indexOf(AWAIT_KEYWORD);
      const range = new vscode.Range(i, col, i, col + AWAIT_KEYWORD.length);
      diagnostics.push(new vscode.Diagnostic(range, REASON, vscode.DiagnosticSeverity.Warning));
    });

    return diagnostics;
  }
};
