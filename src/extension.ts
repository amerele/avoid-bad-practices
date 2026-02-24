import * as vscode from 'vscode';
import { analyze } from './engine';
import { shouldLintOnType } from './config';

let diagnosticCollection: vscode.DiagnosticCollection;

export function activate(context: vscode.ExtensionContext) {
  diagnosticCollection = vscode.languages.createDiagnosticCollection('bad-practices');
  context.subscriptions.push(diagnosticCollection);

  function lint(doc: vscode.TextDocument) {
    if (doc.uri.scheme !== 'file') { return; }
    diagnosticCollection.set(doc.uri, analyze(doc));
  }

  function clear(doc: vscode.TextDocument) {
    diagnosticCollection.delete(doc.uri);
  }

  context.subscriptions.push(
    vscode.workspace.onDidOpenTextDocument(lint),
    vscode.workspace.onDidSaveTextDocument(lint),
    vscode.workspace.onDidCloseTextDocument(clear),

    vscode.workspace.onDidChangeTextDocument(e => {
      if (shouldLintOnType()) { lint(e.document); }
    }),

    vscode.workspace.onDidChangeConfiguration(e => {
      if (e.affectsConfiguration('badPractices')) {
        vscode.workspace.textDocuments.forEach(lint);
      }
    })
  );

  vscode.workspace.textDocuments.forEach(lint);

  console.log('[bad-practices] Extension activated.');
}

export function deactivate() {
  diagnosticCollection?.dispose();
}
