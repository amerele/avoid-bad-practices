import * as vscode from 'vscode';

export const Severity = ['error', 'warning', 'hint', 'info'] as const;
export type TSeverety = typeof Severity[number];

export interface Rule {
  id: string;
  description: string;
  languages: string[];
  defaultSeverity: TSeverety;

  check(document: vscode.TextDocument): vscode.Diagnostic[];
}
