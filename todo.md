# Cozy AI Studio — TODO (sync)

**Mac:** `/Users/erikbabcan/Pictures/cosy-app-kit/todo.md`  
**Sandbox:** `/workspace/todo.md`  
**Prod:** `https://canvas.h4ck3d.me`  
Secrets: len Vercel / `.env.production.local` — nikdy do chatu v plnom znení.

---

## 1. Context
- Stack: TanStack Start · React · Vite · Supabase/Postgres · Mistral · Stripe · Vercel
- Auth: auto A Supabase / B Better Auth
- UI surfaces hotové — ťahá sa env + backend

---

## 2. DONE
- [x] Studio chrome, HitL, Preflight P1, Live Runtime Kernel P0
- [x] Agents SSE, Stripe kód, Launch, WC runtime, dual auth
- [x] `/api/ai-status`, `/api/runtime-status`, `/api/env-status` (ai + wc blocks)
- [x] COOP/COEP (vercel.json, public/_headers, Vite)
- [x] srcDoc fallback + Retry WC + prod banner

---

## 3. MUST DO — teraz

### 🔴 Mistral env (ty na Vercel)
| Krok | Akcia |
|---|---|
| 1 | [console.mistral.ai](https://console.mistral.ai) → API key |
| 2 | Vercel → canvas / cozy project → Settings → Environment Variables → **Production** |
| 3 | `MISTRAL_API_KEY` = (key) |
| 4 | `DEMO_PIPELINE` = `false` |
| 5 | Redeploy Production |
| 6 | `curl -s https://canvas.h4ck3d.me/api/ai-status` → `ok:true`, `provider:"mistral"` |
| 7 | Studio: 1 prompt — **bez** „offline demo pipeline“ |

### 🟠 WebContainer na produkcii
| Krok | Akcia |
|---|---|
| 1 | Otvor **https://canvas.h4ck3d.me/studio** v **novom tabe** (nie Grok embed) |
| 2 | DevTools Console: `crossOriginIsolated` → **true** |
| 3 | Network → document → headers: COEP `require-corp`, COOP `same-origin` |
| 4 | Live Preview badge = **WebContainer** |
| 5 | Accept diff → preview update |

**Pozn.:** V Grok sandbox iframe je srcDoc **očakávaný** (nie bug). WC = top-level prod.

### 🟢 Supabase Path A (2026-07-30)
- [x] Project URL napojený: `uotvcsjoriamsagfprbq.supabase.co`
- [x] Publishable/anon key v `.env` + `AUTH_PROVIDER=supabase`
- [x] `@supabase/supabase-js` (už v package)
- [x] `src/utils/supabase.ts` + alias `VITE_SUPABASE_KEY`
- [x] Auth GoTrue health OK; client `getSession` OK
- [ ] **SERVICE ROLE / secret key** (`SUPABASE_SERVICE_ROLE_KEY` alebo `sb_secret_…`)
- [ ] **DATABASE_URL** (Settings → Database → URI pooler)
- [ ] Migrácie app tabuliek (projects, files, …) — DB je prázdna, `todos` neexistuje
- [ ] Auth redirect v Supabase: `https://canvas.h4ck3d.me/auth/callback` (+ sandbox origin)
- [ ] Tie isté env na **Vercel Production** + redeploy

---

## 4. Env endpoints (žiadne raw secrets)

```bash
curl -s https://canvas.h4ck3d.me/api/ai-status
curl -s https://canvas.h4ck3d.me/api/runtime-status
curl -s https://canvas.h4ck3d.me/api/env-status
```

---

## 5. Triggers
| Phrase | Action |
|---|---|
| `spusti login (Stripe)` | Stripe CLI + prices |
| `auth cesta A supabase` | force Supabase |
| `env-status` | curl checklist |

---

## 6. Security
Mask keys; service role server-only; no secrets in git/chat.
