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

## Next

| # | Item |
|---|---|
| P3 | Freeze Lab/Kernel product claims in playground |
| P4 | Stripe only after activation |
| Manual | DATABASE_URL · STRIPE_* · auth redirect |

## Check

```
GET /api/agents/run → quota.dailyLimit / withinQuota
Studio TopBar: FREE · Nd · N left · Limits (not Go to Production)
```
