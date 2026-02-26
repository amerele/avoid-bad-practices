import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { Severity, TSeverety } from './rules/rule';

type SeverityOrOff = TSeverety | 'off';

interface RcFile {
  rules?: Record<string, string>;
  lintOnType?: boolean;
}

export function getRcFilePath(): string | undefined {
  const folders = vscode.workspace.workspaceFolders;
  if (!folders || folders.length === 0) { return undefined; }
  return path.join(folders[0].uri.fsPath, '.badpracticesrc.json');
}

function readRcFile(): RcFile {
  const rcPath = getRcFilePath();
  if (!rcPath) { return {}; }

  try {
    const raw = fs.readFileSync(rcPath, 'utf8');
    return JSON.parse(raw) as RcFile;
  } catch {
    return {};
  }
}

export function getRuleSeverity(ruleId: string, defaultSeverity: TSeverety): SeverityOrOff {
  const valid: SeverityOrOff[] = [...Severity, 'off'];

  const rc = readRcFile();
  const rcOverride = rc.rules?.[ruleId];
  if (rcOverride && valid.includes(rcOverride as SeverityOrOff)) {
    return rcOverride as SeverityOrOff;
  }

  const config = vscode.workspace.getConfiguration('badPractices');
  const overrides = config.get<Record<string, string>>('rules', {});
  const override = overrides[ruleId];
  if (override && valid.includes(override as SeverityOrOff)) {
    return override as SeverityOrOff;
  }

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
  const rc = readRcFile();
  if (typeof rc.lintOnType === 'boolean') { return rc.lintOnType; }
  return vscode.workspace.getConfiguration('badPractices').get<boolean>('lintOnType', true);
}

export type ObjValues<T> = T[keyof T];
