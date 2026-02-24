import * as vscode from 'vscode';
import { Rule } from './rule';

// Flags else and else-if blocks — prefer early returns or guard clauses

const REASON = 'Avoid else — use early returns or guard clauses to reduce nesting';
const ELSE_PATTERN = /}\s*else\b/;

export const noElse: Rule = {
  id: 'no-else',
  description: REASON,
  languages: ['javascript', 'typescript', 'javascriptreact', 'typescriptreact'],
  defaultSeverity: 'warning',

  check(doc) {
    const diagnostics: vscode.Diagnostic[] = [];
    const lines = doc.getText().split('\n');

    lines.forEach((line: string, i: number) => {
      if (line.trimStart().startsWith('//')) { return; }

      const match = ELSE_PATTERN.exec(line);
      if (!match) { return; }

      const range = new vscode.Range(i, match.index, i, match.index + match[0].length);
      diagnostics.push(new vscode.Diagnostic(range, REASON, vscode.DiagnosticSeverity.Warning));
    });

    return diagnostics;
  }
};
