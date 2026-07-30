/**
 * HTTP long-poll adapter for the same in-memory hub used by WebSocket.
 * Production (Vercel) has no WS upgrade — clients fall back here.
 */

import {
  handleClientMessage,
  registerSocket,
  unregisterSocket,
  type HubSocket,
} from "./hub";
import type { ServerToClient } from "./protocol";

type HttpClient = {
  sock: HubSocket;
  queue: ServerToClient[];
  lastPoll: number;
};

const g = globalThis as typeof globalThis & {
  __caiHttpClients__?: Map<string, HttpClient>;
};

function clients() {
  if (!g.__caiHttpClients__) g.__caiHttpClients__ = new Map();
  return g.__caiHttpClients__;
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json",
      "cache-control": "no-store",
    },
  });
}

/** POST /api/ws/http  body: { op: "open" } | { op: "send", clientId, message } | { op: "close", clientId } */
export async function handleWsHttp(request: Request): Promise<Response> {
  if (request.method === "GET") {
    // long-poll: ?clientId=&waitMs=
    const url = new URL(request.url);
    const clientId = url.searchParams.get("clientId") || "";
    const waitMs = Math.min(
      25_000,
      Math.max(0, Number(url.searchParams.get("waitMs") || 15_000)),
    );
    if (!clientId) return json({ error: "clientId required" }, 400);
    const c = clients().get(clientId);
    if (!c) return json({ error: "unknown client" }, 404);
    c.lastPoll = Date.now();

    const deadline = Date.now() + waitMs;
    while (c.queue.length === 0 && Date.now() < deadline) {
      await new Promise((r) => setTimeout(r, 120));
    }
    const messages = c.queue.splice(0, c.queue.length);
    return json({ clientId, messages });
  }

  if (request.method !== "POST") {
    return json({ error: "method not allowed" }, 405);
  }

  let body: {
    op?: string;
    clientId?: string;
    message?: string | object;
  };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return json({ error: "invalid JSON" }, 400);
  }

  if (body.op === "open") {
    const queue: ServerToClient[] = [];
    const sock = registerSocket((msg) => {
      queue.push(msg);
    });
    clients().set(sock.id, { sock, queue, lastPoll: Date.now() });
    // drain welcome that was already pushed
    const c = clients().get(sock.id)!;
    const initial = c.queue.splice(0, c.queue.length);
    return json({ clientId: sock.id, transport: "http", messages: initial });
  }

  if (body.op === "close") {
    const id = body.clientId || "";
    const c = clients().get(id);
    if (c) {
      unregisterSocket(c.sock.id);
      clients().delete(id);
    }
    return json({ ok: true });
  }

  if (body.op === "send") {
    const id = body.clientId || "";
    const c = clients().get(id);
    if (!c) return json({ error: "unknown client" }, 404);
    c.lastPoll = Date.now();
    const raw =
      typeof body.message === "string"
        ? body.message
        : JSON.stringify(body.message ?? {});
    handleClientMessage(c.sock, raw);
    // return any immediately queued replies
    const messages = c.queue.splice(0, c.queue.length);
    return json({ ok: true, messages });
  }

  return json({ error: "unknown op" }, 400);
}

/** GC idle HTTP clients (no poll for 2 min) */
export function gcHttpClients() {
  const now = Date.now();
  for (const [id, c] of clients()) {
    if (now - c.lastPoll > 120_000) {
      unregisterSocket(c.sock.id);
      clients().delete(id);
    }
  }
}
