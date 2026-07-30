# Cozy AI Studio — TODO

**Prod (osobný):** https://cozy-ai-studio.vercel.app  
**Docs:** `docs/MVP_PROMPTS.md` · `docs/POST_MVP_PROMPTS.md`

## MVP 5 promptov (teraz)
| # | Status | Poznámka |
|---|---|---|
| MVP-1 Persist | kód hotový | treba `DATABASE_URL` na ostrej |
| MVP-2 Auth | kód hotový | Supabase redirect URL |
| MVP-3 Mistral | **live** na prod | ai-status ok |
| MVP-4 Live Runtime | kód hotový | top-level tab |
| MVP-5 Pricing | kód hotový | treba Stripe keys |

**Check:** `GET /api/mvp-status` → `mvpReady` / `sellReady`

## Post-MVP 7 (neskôr)
P1 Launch · P2 Metering · P3 Mobile WS · P4 Telemetry · P5 Domain · P6 RLS · P7 Smoke  
→ `docs/POST_MVP_PROMPTS.md`

## Ty manuálne
1. DATABASE_URL  
2. SUPABASE_SERVICE_ROLE_KEY  
3. Auth redirect `…/auth/callback`  
4. STRIPE_*  
5. Rotuj kľúče z chatu  
