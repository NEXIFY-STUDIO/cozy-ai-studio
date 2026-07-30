/**
 * Preflight before HitL Accept — static checks (no full tsc in browser without WC).
 * When WebContainer is ready, optional shell typecheck can be run separately.
 */

import {
  type FilePatch,
  type PatchValidationIssue,
  type PatchValidationResult,
  validateFilePatches,
} from "./patch-contract";

export type PreflightCheck = {
  id: string;
  label: string;
  status: "pass" | "fail" | "warn" | "skip";
  detail?: string;
};

export type PreflightReport = {
  ok: boolean;
  canAccept: boolean;
  checks: PreflightCheck[];
  patches: FilePatch[];
  issues: PatchValidationIssue[];
  ranAt: number;
};

function balancedBrackets(code: string): boolean {
  const stack: string[] = [];
  const pairs: Record<string, string> = { ")": "(", "]": "[", "}": "{" };
  let inStr: string | null = null;
  let escape = false;
  for (let i = 0; i < code.length; i++) {
    const c = code[i];
    if (inStr) {
      if (escape) {
        escape = false;
        continue;
      }
      if (c === "\\") {
        escape = true;
        continue;
      }
      if (c === inStr) inStr = null;
      continue;
    }
    if (c === '"' || c === "'" || c === "`") {
      inStr = c;
      continue;
    }
    if (c === "/" && code[i + 1] === "/") {
      while (i < code.length && code[i] !== "\n") i++;
      continue;
    }
    if ("([{".includes(c)) stack.push(c);
    else if (")]}".includes(c)) {
      if (stack.pop() !== pairs[c]) return false;
    }
  }
  return stack.length === 0;
}

/**
 * Run contract validation + light static preflight on patches.
 */
export function runPreflight(
  patchesInput: Array<Partial<FilePatch>>,
): PreflightReport {
  const validated: PatchValidationResult = validateFilePatches(patchesInput);
  const checks: PreflightCheck[] = [];

  checks.push({
    id: "contract",
    label: "Patch contract",
    status: validated.ok
      ? "pass"
      : validated.patches.length === 0
        ? "fail"
        : "fail",
    detail: validated.ok
      ? `${validated.stats.files} file(s), ${validated.stats.bytes} B`
      : validated.issues
          .filter((i) => i.severity === "error")
          .map((i) => i.message)
          .slice(0, 3)
          .join("; ") || "Invalid patches",
  });

  const hasTraversal = validated.issues.some(
    (i) => i.code === "PATH_TRAVERSAL" || i.code === "ABSOLUTE_PATH",
  );
  checks.push({
    id: "paths",
    label: "Safe paths",
    status: hasTraversal ? "fail" : "pass",
    detail: hasTraversal ? "Path traversal blocked" : "OK",
  });

  let syntaxOk = true;
  let syntaxDetail = "OK";
  for (const p of validated.patches) {
    if (!/\.(tsx?|jsx?|mjs|cjs)$/i.test(p.path)) continue;
    if (!p.content) continue;
    if (!balancedBrackets(p.content)) {
      syntaxOk = false;
      syntaxDetail = `Unbalanced brackets in ${p.path}`;
      break;
    }
  }
  checks.push({
    id: "syntax",
    label: "Bracket balance",
    status: syntaxOk ? "pass" : "warn",
    detail: syntaxDetail,
  });

  const hasApp = validated.patches.some(
    (p) =>
      /App\.(tsx|jsx)$/i.test(p.path) ||
      p.path === "src/App.tsx" ||
      p.path.endsWith("/App.tsx"),
  );
  checks.push({
    id: "entry",
    label: "App entry present",
    status: hasApp || validated.patches.length > 0 ? (hasApp ? "pass" : "warn") : "fail",
    detail: hasApp ? "src/App.tsx / App in patch set" : "No App.tsx in this turn (may be OK)",
  });

  checks.push({
    id: "wc",
    label: "WebContainer write",
    status: "skip",
    detail: "Runs on Accept → writeFile + reload",
  });

  const hardFail = checks.some((c) => c.status === "fail");
  const contractFail = !validated.ok;

  return {
    ok: !hardFail && !contractFail,
    // Allow Accept even on warn; block only hard contract failures with zero valid patches
    canAccept: validated.patches.length > 0 && !hasTraversal,
    checks,
    patches: validated.patches,
    issues: validated.issues,
    ranAt: Date.now(),
  };
}
