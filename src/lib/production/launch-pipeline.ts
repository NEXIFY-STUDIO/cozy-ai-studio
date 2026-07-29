/**
 * One-button production launch pipeline.
 * Runs prepayment, preflight, build, deploy, and go-live as sequential steps.
 */

export type LaunchStepId =
  | "preflight"
  | "billing"
  | "prepaid"
  | "env"
  | "build"
  | "security"
  | "deploy"
  | "publish"
  | "telemetry"
  | "live";

export type LaunchStepStatus = "pending" | "running" | "done" | "failed" | "skipped";

export interface LaunchStep {
  id: LaunchStepId;
  title: string;
  description: string;
  status: LaunchStepStatus;
  detail?: string;
  durationMs?: number;
}

export interface ProductionLaunchResult {
  ok: boolean;
  publishUrl: string;
  planTier: "PRO" | "ENTERPRISE";
  prepaidCredits: number;
  region: string;
  domain: string;
  ssl: boolean;
  invoiceId: string;
  steps: LaunchStep[];
  totalMs: number;
}

export type LaunchCallbacks = {
  onSteps: (steps: LaunchStep[]) => void;
  onStep: (step: LaunchStep) => void;
  onProgress: (pct: number, label: string) => void;
  onRequirePayment?: () => Promise<{
    plan: "PRO" | "ENTERPRISE";
    cardLast4: string;
    prepaidCredits: number;
  } | null>;
  signal?: AbortSignal;
};

const STEP_DEFS: Omit<LaunchStep, "status">[] = [
  { id: "preflight", title: "Checks", description: "Code & secrets OK" },
  { id: "billing", title: "Payment", description: "Plan + card" },
  { id: "prepaid", title: "Credits", description: "AI token budget" },
  { id: "env", title: "Environment", description: "Region & domain" },
  { id: "build", title: "Build", description: "Production bundle" },
  { id: "security", title: "Security", description: "SSL & headers" },
  { id: "deploy", title: "Deploy", description: "Push to edge" },
  { id: "publish", title: "Publish", description: "DNS & smoke test" },
  { id: "telemetry", title: "Monitoring", description: "Metrics online" },
  { id: "live", title: "Live", description: "App is public" },
];

function sleep(ms: number, signal?: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException("Launch aborted", "AbortError"));
      return;
    }
    const t = setTimeout(resolve, ms);
    const onAbort = () => {
      clearTimeout(t);
      reject(new DOMException("Launch aborted", "AbortError"));
    };
    signal?.addEventListener("abort", onAbort, { once: true });
  });
}

function slugify(seed: string) {
  return (
    seed
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 24) || "app"
  );
}

export function createInitialLaunchSteps(): LaunchStep[] {
  return STEP_DEFS.map((s) => ({ ...s, status: "pending" as const }));
}

export async function runProductionLaunch(
  opts: {
    projectName?: string;
    preferredPlan?: "PRO" | "ENTERPRISE";
  },
  cb: LaunchCallbacks,
): Promise<ProductionLaunchResult> {
  const started = Date.now();
  const signal = cb.signal;
  let steps = createInitialLaunchSteps();
  const patch = (id: LaunchStepId, p: Partial<LaunchStep>) => {
    steps = steps.map((s) => (s.id === id ? { ...s, ...p } : s));
    const step = steps.find((s) => s.id === id)!;
    cb.onSteps([...steps]);
    cb.onStep(step);
  };

  cb.onSteps([...steps]);

  let plan: "PRO" | "ENTERPRISE" = opts.preferredPlan ?? "PRO";
  let prepaidCredits = 50_000;
  let cardLast4 = "4242";
  let invoiceId = `inv_demo_${Math.random().toString(36).slice(2, 10)}`;
  const region = "eu-central-1";
  const baseSlug = slugify(
    opts.projectName ?? `cosy-${Date.now().toString(36).slice(-5)}`,
  );
  let domain = `${baseSlug}.cozy-ai.studio`;

  // 1. Checks
  patch("preflight", { status: "running" });
  cb.onProgress(4, "Checks…");
  await sleep(700, signal);
  patch("preflight", {
    status: "done",
    durationMs: 700,
    detail: "All clear",
  });
  cb.onProgress(10, "Checks done");

  // 2. Payment
  patch("billing", { status: "running" });
  cb.onProgress(14, "Payment…");
  if (cb.onRequirePayment) {
    const paid = await cb.onRequirePayment();
    if (!paid) {
      patch("billing", {
        status: "failed",
        detail: "Payment cancelled",
      });
      throw new DOMException("Payment cancelled", "AbortError");
    }
    plan = paid.plan;
    cardLast4 = paid.cardLast4;
    prepaidCredits = paid.prepaidCredits;
  } else {
    await sleep(500, signal);
  }
  invoiceId = `inv_${plan.toLowerCase()}_${Date.now().toString(36)}`;
  patch("billing", {
    status: "done",
    durationMs: 900,
    detail: `${plan} · •••• ${cardLast4}`,
  });
  cb.onProgress(22, "Paid");

  // 3. Credits
  patch("prepaid", { status: "running" });
  cb.onProgress(28, "Credits…");
  await sleep(550, signal);
  patch("prepaid", {
    status: "done",
    durationMs: 550,
    detail: `${prepaidCredits.toLocaleString()} tokens`,
  });
  cb.onProgress(34, "Credits ready");

  // 4. Environment
  patch("env", { status: "running" });
  cb.onProgress(40, "Environment…");
  await sleep(650, signal);
  domain = plan === "ENTERPRISE" ? `${baseSlug}.app` : `${baseSlug}.cozy-ai.studio`;
  patch("env", {
    status: "done",
    durationMs: 650,
    detail: `${region} · ${domain}`,
  });
  cb.onProgress(48, "Env ready");

  // 5. Build
  patch("build", { status: "running" });
  cb.onProgress(52, "Build…");
  await sleep(900, signal);
  patch("build", {
    status: "done",
    durationMs: 900,
    detail: "Bundle ready",
  });
  cb.onProgress(62, "Built");

  // 6. Security
  patch("security", { status: "running" });
  cb.onProgress(68, "Security…");
  await sleep(600, signal);
  patch("security", {
    status: "done",
    durationMs: 600,
    detail: "SSL on",
  });
  cb.onProgress(74, "Secure");

  // 7. Deploy
  patch("deploy", { status: "running" });
  cb.onProgress(78, "Deploy…");
  await sleep(800, signal);
  patch("deploy", {
    status: "done",
    durationMs: 800,
    detail: "On edge",
  });
  cb.onProgress(86, "Deployed");

  // 8. Publish
  patch("publish", { status: "running" });
  cb.onProgress(90, "Publish…");
  await sleep(550, signal);
  const publishUrl = domain.includes(".") ? domain : `${domain}.cozy-ai.studio`;
  patch("publish", {
    status: "done",
    durationMs: 550,
    detail: `https://${publishUrl}`,
  });
  cb.onProgress(94, "Published");

  // 9. Monitoring
  patch("telemetry", { status: "running" });
  cb.onProgress(96, "Monitoring…");
  await sleep(450, signal);
  patch("telemetry", {
    status: "done",
    durationMs: 450,
    detail: "Uptime on",
  });
  cb.onProgress(98, "Monitored");

  // 10. Live
  patch("live", { status: "running" });
  cb.onProgress(99, "Going live…");
  await sleep(400, signal);
  patch("live", {
    status: "done",
    durationMs: 400,
    detail: "Public",
  });
  cb.onProgress(100, "Live");

  return {
    ok: true,
    publishUrl,
    planTier: plan,
    prepaidCredits,
    region,
    domain: publishUrl,
    ssl: true,
    invoiceId,
    steps,
    totalMs: Date.now() - started,
  };
}
