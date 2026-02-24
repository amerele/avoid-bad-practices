import * as vscode from "vscode";
import { Rule } from "./rule";

// Flag overnested code lines 

const MAX_NESTING_FLAGS = 3;
const SPACES_PER_LEVEL = 2;
const REASON =
  `Nesting deeper than ${MAX_NESTING_FLAGS} levels — refactor or reduce complexity`;

export const deepNesting: Rule = {
  id: "deep-nesting",
  description: REASON,
  languages: [
    "javascript",
    "typescript",
    "javascriptreact",
    "typescriptreact",
    "python",
    "java",
    "c",
    "cpp",
  ],
  defaultSeverity: "hint",

  check(doc) {
    const diagnostics: vscode.Diagnostic[] = [];
    const lines = doc.getText().split("\n");

    lines?.forEach((line: any, i: number) => {
      if (line?.trim() === "") {
        return;
      }

      const leading = line?.match(/^(\s*)/)?.[1] ?? "";
      const depth = leading?.includes("\t")
        ? leading.split("\t").length - 1
        : Math.floor(leading.length / SPACES_PER_LEVEL);

      if (depth >= MAX_NESTING_FLAGS) {
        const range = new vscode.Range(i, 0, i, leading.length);
        diagnostics.push(
          new vscode.Diagnostic(range, REASON, vscode.DiagnosticSeverity.Hint),
        );
      }
    });

    return diagnostics;
  },
};
