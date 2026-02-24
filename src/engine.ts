import * as vscode from 'vscode';
import { allRules } from './rules';
import { getRuleSeverity, toVscodeSeverity } from './config';

export function analyze(doc: vscode.TextDocument): vscode.Diagnostic[] {
  const all: vscode.Diagnostic[] = [];

  for (const rule of allRules) {
    const appliesToLanguage =
      rule.languages.includes('*') || rule.languages.includes(doc.languageId);

    if (!appliesToLanguage) { continue; }

    const severity = getRuleSeverity(rule.id, rule.defaultSeverity);
    if (severity === 'off') { continue; }

    let ruleDiagnostics: vscode.Diagnostic[];
    try {
      ruleDiagnostics = rule.check(doc);
    } catch (err) {
      console.error(`[bad-practices] Rule "${rule.id}" threw an error:`, err);
      continue;
    }

    for (const diag of ruleDiagnostics) {
      diag.severity = toVscodeSeverity(severity);
      diag.source = `bad-practices(${rule.id})`;
      all.push(diag);
    }
  }

  return all;
}
