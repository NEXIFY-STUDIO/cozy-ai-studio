# Clean Editor

## What it does
Permanently resets the **session editor state** in Cozy AI Studio after a **2-step confirmation** in the Brief panel.

## User flow
1. Click **Clean editor** (Brief header, under FREE quota).
2. Button turns destructive: **Potvrdiť clean** (5s arm window).
3. Second click → wipe + success toast.

## What is wiped
- Chat history (back to single welcome system message)
- Project files → starter `src/App.tsx` + `src/styles.css` + `package.json`
- Diff / original / modified code
- Agents → idle G0 / G1 / G2
- Pending HitL approval + preflight
- Share URL / id
- Local telemetry buffer
- Pipeline progress / errors / retry state
- Preview → starter HTML

## What is kept
- Theme, device preset (iPhone 17 Air default)
- Server quota counters (`promptsUsed`, `dailyUsed`, plan tier)
- Production launch prefs
- Showcase list

## Implementation
- Store: `cleanEditor()` in `src/stores/studio-store.ts`
- UI: button + arm state in `src/components/studio/AgentPanel.tsx`
- Tracking issue: https://github.com/NEXIFY-STUDIO/cozy-ai-studio/issues/26

## Status
**IMPLEMENTED** (2026-07-31). `cleanEditor()` + Brief header button with 2-step arm (5s) landed. Quota / theme / device / production prefs preserved. Deploy will pick up on next Vercel build.
