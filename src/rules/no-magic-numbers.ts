import * as vscode from "vscode";
import { Rule } from "./rule";

const REASON = (number: string) =>
  `Magic number: ${number}. Extract it to a named constant.`;
// Flags numeric literals that aren't part of a named constant declaration. (except by 0 or 1)
export const noMagicNumbers: Rule = {
  id: "no-magic-numbers",
  description: "Magic number — extract to a named constant",
  languages: ["javascript", "typescript", "javascriptreact", "typescriptreact"],
  defaultSeverity: "warning",

  check(doc) {
    const diagnostics: vscode.Diagnostic[] = [];
    const text = doc.getText();
    const lines = text.split("\n");

    const IsDeclarative = /^\s*(const|let|var|readonly|enum)\s+[A-Z_]+\s*=/;

    // 0 or 1
    const isNormalNumber = /(?<![a-zA-Z_$.])\b([2-9]\d*|[1-9]\d+)\b/g;

    lines.forEach((line: string, i: number) => {
      const trimLine = line.trimStart();
      const isCodeComment =
        trimLine.startsWith("//") || trimLine.startsWith("*");

      if (isCodeComment || IsDeclarative.test(line)) return;

      let match: RegExpExecArray | null;
      isNormalNumber.lastIndex = 0;

      while ((match = isNormalNumber.exec(line)) !== null) {
        const col = match.index;
        const range = new vscode.Range(i, col, i, col + match[0].length);
        diagnostics.push(
          new vscode.Diagnostic(
            range,
            REASON(match[0]),
            vscode.DiagnosticSeverity.Warning,
          ),
        );
      }
    });

    return diagnostics;
  },
};
