import * as vscode from 'vscode';
import { Rule } from './rule';


const REASON = (method: string) => `console.${method}() found — remove or replace with a proper logger.`;

// Flags console functions left in source files.
export const noConsole: Rule = {
  id: 'no-console',
  description: 'console.* call — remove before committing or use a logger',
  languages: ['javascript', 'typescript', 'javascriptreact', 'typescriptreact'],
  defaultSeverity: 'warning',


  check(doc) {
    const diagnostics: vscode.Diagnostic[] = [];
    const lines = doc.getText().split('\n');

    const pattern = /console\.(log|warn|error|info|debug)\s*\(/g;

    lines.forEach((line: string, i: number) => {
      if (line?.trimStart()?.startsWith('//')) { return; }
      let match: RegExpExecArray | null;
      pattern.lastIndex = 0;

      while ((match = pattern.exec(line)) !== null) {
        const range = new vscode.Range(i, match.index, i, match.index + match[0].length);
        diagnostics.push(new vscode.Diagnostic(
          range,
          REASON(match[1]),
          vscode.DiagnosticSeverity.Warning
        ));
      }
    });

    return diagnostics;
  }
};
