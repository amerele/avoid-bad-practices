import * as vscode from 'vscode';
import { Rule } from './rule';

const reason = "go to JIRA and open a technical debt card, bro 😭"

// Highlights TODO, FIXME, HACK, XXX comments
export const noTodoComments: Rule = {
  id: 'no-todo-comments',
  description: 'Unresolved TODO/FIXME comment',
  languages: ['javascript', 'typescript', 'javascriptreact', 'typescriptreact'],
  defaultSeverity: 'hint',

  check(doc) {
    const diagnostics: vscode.Diagnostic[] = [];
    const lines = doc.getText().split('\n');
    const pattern = /\b(TODO|FIXME|HACK|XXX|FIX)\b[:\s]*(.*)/i;

    lines.forEach((line: string, i: number) => {
      const match = pattern.exec(line);
      if (!match) { return; }

      const col = match.index;
      const range = new vscode.Range(i, col, i, line.length);
      const tag = match[1].toUpperCase();
      const note = match[2].trim();

      diagnostics.push(new vscode.Diagnostic(
        range,
        note ? `${tag}: ${note} — ${reason}` : `${tag} — ${reason}`,
        vscode.DiagnosticSeverity.Hint
      ));
    });

    return diagnostics;
  }
};
