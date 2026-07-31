/**
 * Server-only public preview shares (Option B spine).
 */

import { getSql } from "@/lib/db";
import { ensureUserRow } from "@/lib/projects/server";

export type SharedPreview = {
  id: string;
  user_id: string | null;
  project_id: string | null;
  title: string;
  html: string;
  prompt_preview: string | null;
  source_code: string | null;
  source_language: string;
  source_path: string;
  created_at: string;
  expires_at: string | null;
};

const MAX_HTML_BYTES = 1_500_000; // ~1.5 MB
/** Soft free-tier share cap (not AI quota). */
export const SHARE_DAILY_LIMIT = Number(process.env.SHARE_DAILY_LIMIT ?? "40");

function newShareId() {
  // short opaque id; public path is /a/{id}
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

export async function createSharedPreview(opts: {
  userId: string;
  html: string;
  title?: string;
  projectId?: string | null;
  promptPreview?: string | null;
  sourceCode?: string | null;
  sourceLanguage?: string | null;
  sourcePath?: string | null;
}): Promise<{ id: string; path: string }> {
  const html = opts.html?.trim() || "";
  if (!html) {
    throw new Error("EMPTY_HTML");
  }
  if (new TextEncoder().encode(html).length > MAX_HTML_BYTES) {
    throw new Error("HTML_TOO_LARGE");
  }

  await ensureUserRow(opts.userId);

  const sql = await getSql();
  const dayStart = new Date();
  dayStart.setUTCHours(0, 0, 0, 0);
  const cnt = await sql<{ n: number }>`
    select count(*)::int as n
    from shared_previews
    where user_id = ${opts.userId}
      and created_at >= ${dayStart.toISOString()}
  `;
  if (Number(cnt[0]?.n ?? 0) >= SHARE_DAILY_LIMIT) {
    throw new Error("SHARE_DAILY_LIMIT");
  }

  const id = newShareId();
  const title = (opts.title?.trim() || "Cozy preview").slice(0, 120);
  const promptPreview = (opts.promptPreview || "").slice(0, 280) || null;
  const sourceCode = opts.sourceCode?.trim() || null;
  const sourceLanguage = (opts.sourceLanguage || "tsx").slice(0, 32);
  const sourcePath = (opts.sourcePath || "src/App.tsx").slice(0, 200);

  await sql`
    insert into shared_previews (
      id, user_id, project_id, title, html, prompt_preview,
      source_code, source_language, source_path
    ) values (
      ${id},
      ${opts.userId},
      ${opts.projectId ?? null},
      ${title},
      ${html},
      ${promptPreview},
      ${sourceCode},
      ${sourceLanguage},
      ${sourcePath}
    )
  `;

  return { id, path: `/a/${id}` };
}

export async function getSharedPreview(
  id: string,
): Promise<SharedPreview | null> {
  if (!id || !/^[a-z0-9]{8,40}$/i.test(id)) return null;
  const sql = await getSql();
  const rows = await sql<SharedPreview>`
    select id, user_id, project_id, title, html, prompt_preview,
           source_code, source_language, source_path,
           created_at::text, expires_at::text
    from shared_previews
    where id = ${id}
      and (expires_at is null or expires_at > CURRENT_TIMESTAMP)
    limit 1
  `;
  return rows[0] ?? null;
}
