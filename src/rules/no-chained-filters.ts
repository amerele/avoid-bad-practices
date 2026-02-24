import * as vscode from 'vscode';
import { Rule } from './rule';

// Flags multiple filter calls appearing close together — combine into one

const REASON = 'Multiple filter calls — combine into a single filter with a composed condition';
const FILTER_PATTERN = /\.filter\s*\(/g;
const MAX_FILTER_GAP = 5;
const NO_PREVIOUS_FILTER = -1;

export const noChainedFilters: Rule = {
  id: 'no-chained-filters',
  description: REASON,
  languages: ['javascript', 'typescript', 'javascriptreact', 'typescriptreact'],
  defaultSeverity: 'warning',

  check(doc) {
    const diagnostics: vscode.Diagnostic[] = [];
    const lines = doc.getText().split('\n');

    let lastFilterLine = NO_PREVIOUS_FILTER;

    lines.forEach((line: string, i: number) => {
      if (line.trimStart().startsWith('//')) { return; }

      FILTER_PATTERN.lastIndex = 0;
      const match = FILTER_PATTERN.exec(line);
      if (!match) { return; }

      if (lastFilterLine !== NO_PREVIOUS_FILTER && i - lastFilterLine <= MAX_FILTER_GAP) {
        const range = new vscode.Range(i, match.index, i, match.index + match[0].length);
        diagnostics.push(new vscode.Diagnostic(range, REASON, vscode.DiagnosticSeverity.Warning));
      }

      lastFilterLine = i;
    });

    return diagnostics;
  }
};
