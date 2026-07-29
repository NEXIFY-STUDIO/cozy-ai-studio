# Cozy AI Studio

**cozy-ai-studio** — multi-agent visual IDE.

Warm Brutalism · chocolate accent · canvas grey `#141414`  
Plan → Code → Audit with you in the loop.

## Product

| Surface | Path | Description |
| --- | --- | --- |
| Landing | `/` | SK marketing, prompt dock → studio |
| Studio | `/studio` | Agents · Code Diff · Live Preview |
| Lab | `/playground` | Builder Kernel, Plugin SDK, Mistral stream, canvas, presence |
| Pricing | `/pricing` | Free / Pro tiers |
| Showcase | `/showcase` | Published demos |
| Mobile | `/mobile` | Companion review PWA |

### Core stack

- **TanStack Start** + Vite + React 19 + TypeScript  
- **Tailwind v4** · Warm Brutalism tokens (choco / silver / canvas)  
- **Zustand** state · Monaco Diff · multi-agent pipeline (G0 / G1 / G2)  
- **Builder Kernel** + **Plugin SDK** demos in Lab  
- Production launch wizard (checks → payment → build → live)

### Agents

1. **G0 Planner** — task graph from prompt  
2. **G1 Coder** — streaming code diffs  
3. **G2 Auditor** — OWASP / style gates + optional auto-heal  

Human-in-the-loop approval before write. Transient errors retry with backoff.

## Quick start

```bash
# Install (Node 22+)
npm install

# Dev — binds 0.0.0.0:8080
npm run dev

# Typecheck / production build
npm run typecheck
npm run build
```

After hibernate/revive the sandbox runs `startup.sh`, which starts the same dev server.

## Repo layout

```text
src/
  routes/           # landing, studio, playground, pricing, showcase, mobile
  components/studio # AgentPanel, CodeDiff, LivePreview, ProductionLaunch…
  lib/ai/           # orchestrator, retry, errors, generators
  lib/playground/   # Builder Kernel + Plugin SDK demos
  lib/production/   # launch pipeline steps
  stores/           # zustand (cozy-ai-studio-v1)
  styles.css        # design tokens
```

## Brand

| Item | Value |
| --- | --- |
| Product name | **Cozy AI Studio** |
| Package / repo slug | `cozy-ai-studio` |
| Persist key | `cozy-ai-studio-v1` |
| Accent | Chocolate `#6b3f24` / milk `#c48a5a` (dark) |
| Canvas | `#141414` |
| Theme toggle | Cream ↔ Silver gunmetal |

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Dev server on `:8080` |
| `npm run build` | Production build (+ migrate) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint |
| `npm run preview` | Serve built app on `:8080` |

## Deploy notes

- Vite config gates Nitro `vercel` preset on `command === "build"`.  
- App must listen on **`0.0.0.0:8080`** for the live preview.  
- Confirm `npm run build` + browser render of built output before shipping.

## License

Private — NEXIFY-STUDIO / Cozy AI Studio.
