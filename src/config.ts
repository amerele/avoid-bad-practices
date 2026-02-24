import * as vscode from 'vscode';
import { Severity, TSeverety } from './rules/rule';

type SeverityOrOff = TSeverety | 'off';

export function getRuleSeverity(ruleId: string, defaultSeverity: TSeverety): SeverityOrOff {
  const config = vscode.workspace.getConfiguration('badPractices');
  const overrides = config.get<Record<string, string>>('rules', {});
  const override = overrides[ruleId];

  if (!override) { return defaultSeverity; }

  const valid: SeverityOrOff[] = [...Severity, 'off'];
  if (valid.includes(override as SeverityOrOff)) {
    return override as SeverityOrOff;
  }

  console.warn(`[bad-practices] Unknown severity "${override}" for rule "${ruleId}". Falling back to default.`);
  return defaultSeverity;
}

export function toVscodeSeverity(severity: TSeverety): vscode.DiagnosticSeverity {
  switch (severity) {
    case 'error':   return vscode.DiagnosticSeverity.Error;
    case 'warning': return vscode.DiagnosticSeverity.Warning;
    case 'info':    return vscode.DiagnosticSeverity.Information;
    case 'hint':    return vscode.DiagnosticSeverity.Hint;
  }
}
export function shouldLintOnType(): boolean {
  return vscode.workspace.getConfiguration('badPractices').get<boolean>('lintOnType', true);
}


export type ObjValues<T> = T[keyof T];