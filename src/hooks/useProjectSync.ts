/**
 * Hydrate studio files/approvals/telemetry from server DB.
 * Persist file writes server-side (not only localStorage cozy-ai-studio-v1).
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { useStudioStore, type PlanTier, type ProjectFile } from "@/stores/studio-store";
import { authEnabled } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import {
  loadMyWorkspace,
  recordMyTelemetry,
  resolveMyApproval,
  saveMyProjectFiles,
  createMyApproval,
} from "@/lib/db/functions";

const PROJECT_ID_KEY = "cai-active-project-id";

export function useProjectSync() {
  const { user, isPending } = useCurrentUserState();
  const [projectId, setProjectId] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      return window.localStorage.getItem(PROJECT_ID_KEY);
    } catch {
      return null;
    }
  });
  const [hydrated, setHydrated] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSnapshot = useRef<string>("");

  // Hydrate from server when signed in
  useEffect(() => {
    if (!authEnabled) {
      setHydrated(true);
      return;
    }
    if (isPending) return;
    if (!user) {
      setHydrated(true);
      return;
    }

    let cancelled = false;
    setSyncing(true);
    void loadMyWorkspace({ data: projectId })
      .then((ws) => {
        if (cancelled) return;
        setProjectId(ws.project.id);
        try {
          window.localStorage.setItem(PROJECT_ID_KEY, ws.project.id);
        } catch {
          /* ignore */
        }

        const filesMap: Record<string, ProjectFile> = {};
        for (const f of ws.files) {
          filesMap[f.path] = {
            path: f.path,
            language: f.language,
            content: f.content,
          };
        }

        const active = ws.project.active_file || "src/App.tsx";
        const activeContent =
          filesMap[active]?.content ??
          Object.values(filesMap)[0]?.content ??
          useStudioStore.getState().originalCode;

        useStudioStore.setState({
          activeFile: active,
          files:
            Object.keys(filesMap).length > 0
              ? filesMap
              : useStudioStore.getState().files,
          originalCode: activeContent,
          modifiedCode: activeContent,
          planTier: (ws.subscription?.plan_tier as PlanTier) ||
            (ws.project.plan_tier as PlanTier) ||
            "FREE",
          promptsUsed: ws.usage.promptsUsed,
          telemetry: ws.recentTelemetry.map((t) => ({
            id: t.id,
            prompt: t.prompt,
            status: t.status as "APPROVED" | "REJECTED",
            rejectionReason: (t.rejection_reason as never) ?? null,
            agentType: t.agent_type,
            latencyMs: t.latency_ms,
            createdAt: Date.parse(t.created_at) || Date.now(),
          })),
        });

        // Restore pending HitL card if any
        const pending = ws.pendingApprovals[0];
        if (pending) {
          let affected: string[] = [];
          try {
            affected = JSON.parse(pending.affected_files_json) as string[];
          } catch {
            affected = [];
          }
          useStudioStore.setState({
            pendingApproval: {
              title: pending.title,
              description: pending.description,
              affectedFiles: affected,
              originalCode: pending.original_code,
              modifiedCode: pending.modified_code,
              language: pending.language,
              previewHtml: pending.preview_html || "",
            },
            originalCode: pending.original_code,
            modifiedCode: pending.modified_code,
            language: pending.language,
          });
          // stash approval id for resolve
          try {
            window.sessionStorage.setItem("cai-pending-approval-id", pending.id);
          } catch {
            /* ignore */
          }
        }

        lastSnapshot.current = JSON.stringify(filesMap);
        setHydrated(true);
      })
      .catch((e) => {
        console.warn("[project-sync] hydrate failed", e);
        setHydrated(true);
      })
      .finally(() => {
        if (!cancelled) setSyncing(false);
      });

    return () => {
      cancelled = true;
    };
  }, [user, isPending, projectId]);

  // Debounced persist files → server
  const persistFiles = useCallback(async () => {
    if (!authEnabled || !user || !projectId) return;
    const state = useStudioStore.getState();
    const files = Object.values(state.files).map((f) => ({
      path: f.path,
      language: f.language,
      content: f.content,
    }));
    const snap = JSON.stringify(
      Object.fromEntries(files.map((f) => [f.path, f])),
    );
    if (snap === lastSnapshot.current) return;
    lastSnapshot.current = snap;
    try {
      await saveMyProjectFiles({
        data: {
          projectId,
          files,
          activeFile: state.activeFile,
        },
      });
    } catch (e) {
      console.warn("[project-sync] save failed", e);
    }
  }, [user, projectId]);

  // Watch store file changes
  useEffect(() => {
    if (!hydrated || !user || !projectId) return;
    const unsub = useStudioStore.subscribe((s, prev) => {
      if (s.files === prev.files && s.activeFile === prev.activeFile) return;
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => {
        void persistFiles();
      }, 800);
    });
    return () => {
      unsub();
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [hydrated, user, projectId, persistFiles]);

  return { projectId, hydrated, syncing, persistFiles };
}

/** Create server approval when HitL card is shown */
export async function persistPendingApproval(opts: {
  projectId: string | null;
  title: string;
  description: string;
  affectedFiles: string[];
  originalCode: string;
  modifiedCode: string;
  language: string;
  previewHtml: string;
}) {
  if (!authEnabled) return null;
  try {
    const row = await createMyApproval({
      data: {
        projectId: opts.projectId,
        title: opts.title,
        description: opts.description,
        affectedFiles: opts.affectedFiles,
        originalCode: opts.originalCode,
        modifiedCode: opts.modifiedCode,
        language: opts.language,
        previewHtml: opts.previewHtml,
      },
    });
    try {
      window.sessionStorage.setItem("cai-pending-approval-id", row.id);
    } catch {
      /* ignore */
    }
    return row.id;
  } catch {
    return null;
  }
}

export async function resolveServerApproval(
  status: "approved" | "rejected",
  rejectionReason?: string | null,
) {
  if (!authEnabled) return;
  let approvalId: string | null = null;
  try {
    approvalId = window.sessionStorage.getItem("cai-pending-approval-id");
  } catch {
    approvalId = null;
  }
  if (!approvalId) return;
  try {
    await resolveMyApproval({
      data: { approvalId, status, rejectionReason },
    });
    window.sessionStorage.removeItem("cai-pending-approval-id");
  } catch (e) {
    console.warn("[project-sync] resolve approval", e);
  }
}

export async function persistTelemetry(entry: {
  prompt: string;
  status: "APPROVED" | "REJECTED";
  rejectionReason?: string | null;
  agentType: string;
  latencyMs: number;
  projectId?: string | null;
}) {
  if (!authEnabled) return;
  try {
    await recordMyTelemetry({ data: entry });
  } catch {
    /* offline / unauth */
  }
}

export function getActiveProjectId(): string | null {
  try {
    return window.localStorage.getItem(PROJECT_ID_KEY);
  } catch {
    return null;
  }
}
