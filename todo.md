# Cozy AI Studio — TODO (Option B · Speed Studio)

**Prod:** https://cozy-ai-studio.vercel.app  
**SoT:** [docs/SOURCE_OF_TRUTH.md](docs/SOURCE_OF_TRUTH.md)

## Done

| # | Item |
|---|---|
| P0.1 | Truth cut landing |
| P0.2 | Primary path `/` → `/studio` |
| P0.3 | Pricing honesty (no fake Pro checkout) |
| P0.4 | SOURCE_OF_TRUTH.md |
| P1.1 | Hard daily+monthly quota before Mistral (429) |
| P1.2 | TopBar: FREE + remaining, not fake PRO; brand Cozy |
| P1.3 | Production button → **Limits** when Stripe off |
| P2.1 | Empty-state 3 templates (café / dashboard / pricing) |
| P2.2 | Share in Live Preview + toast after pipeline |
| P2.3 | `npm run ship-gate` e2e truth + quota + freeze checks |
| P3 | Freeze Lab/Kernel product claims (playground noindex + banner) |
| Polish | Studio TTFP: auto-run landing brief, Stop, next-step Diff→Share, share helper |

## Next

| # | Item |
|---|---|
| P4 | Stripe only after activation (keep UI "Not live yet") |
| Manual | DATABASE_URL · STRIPE_* · auth redirect on Vercel |

## Check

```
npm run typecheck && npm run lint && npm run build
npm run ship-gate   # server must be up on :8080
GET /api/agents/run → dailyLimit 20, promptLimit 100
Studio: FREE · Limits · templates · Share
/playground: Experimental / not product banner
```
