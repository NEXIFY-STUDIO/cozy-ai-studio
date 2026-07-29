# Cozy AI Studio — Project Card

**Repo slug:** `cozy-ai-studio`  
**Product name:** Cozy AI Studio  
**Owner org:** NEXIFY-STUDIO

Tento dokument je hlavný projektový kontext pre vývojárov a AI asistentov (Cursor, Windsurf, Claude, Copilot).

---

## 1. O projekte

| Položka | Hodnota |
| --- | --- |
| Názov | **Cozy AI Studio** |
| Slug | `cozy-ai-studio` |
| Typ | AI-powered visual IDE & multi-agent builder |
| Cieľ | Odstrániť priepasť medzi dizajnom a kódom — plan → code → audit s human-in-the-loop |
| Estetika | Warm Brutalism · chocolate accent · canvas grey `#141414` · silver theme |

**Hlavná myšlienka:** Multi-agent pipeline (G0 Planner, G1 Coder, G2 Auditor), vizuálny code diff, live preview a Lab playground (Builder Kernel + Plugin SDK).

---

## 2. Tech stack (aktuálna implementácia)

* **Framework:** TanStack Start + Vite 8 + React 19 + TypeScript (strict)
* **Styling:** Tailwind CSS v4 · design tokens v `src/styles.css`
* **UI:** Radix / shadcn-style · Lucide icons · Sonner
* **Editor:** `@monaco-editor/react` (Diff)
* **State:** Zustand (`cozy-ai-studio-v1` persist key)
* **AI demo:** multi-agent orchestrator + retry policy (Mistral-only gateway demo in Lab)
* **Deploy target:** Vercel (Nitro preset gated on production build)
* **Port contract:** `0.0.0.0:8080` (`npm run dev` / `startup.sh`)

> Poznámka: starší backlog spomínal Next.js — **canonical stack je TanStack Start**, nie Next App Router.

---

## 3. Surfaces

| Route | Účel |
| --- | --- |
| `/` | SK landing + prompt dock |
| `/studio` | Hlavný builder (agenti · diff · preview) |
| `/playground` | Cozy Lab — Kernel, plugins, AI stream, canvas, presence |
| `/pricing` | Free / Pro |
| `/showcase` | Galéria |
| `/mobile` | Companion review |

---

## 4. Agent pipeline

1. **G0** — plán a task graph  
2. **G1** — streamovaný kód / diff  
3. **G2** — audit + optional auto-heal  
4. **HitL** — schválenie pred zápisom  
5. **Retry** — exponential backoff na transient errors  

Production: **Go to Production** wizard (checks → payment → credits → build → deploy → live).

---

## 5. Branding rules

* UI copy: **Cozy AI Studio** (nie COSY)  
* Package / GitHub: `cozy-ai-studio`  
* Publish demo host: `*.cozy-ai.studio`  
* CSS utility class `cosy-scroll` zostáva (interný token, nepremenovávať)  

---

## 6. Dev commands

```bash
npm install
npm run dev          # 0.0.0.0:8080
npm run typecheck
npm run build
npm run preview
```

---

## 7. Definition of done

* [ ] Dev server na `:8080`, browser render bez console errors  
* [ ] `npm run build` + built output renders  
* [ ] Mobile ~390px: ľavý rail / taby použiteľné  
* [ ] Branding Cozy AI Studio konzistentné v UI + README  
