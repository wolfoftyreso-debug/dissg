# DISSG

Diagnostic Infrastructure for Societal Governance.

## Local development

```sh
npm install
npm run dev
```

The app runs via Vite on port `8080` by default.

## Scripts

- `npm run dev`
- `npm run build`
- `npm run preview`
- `npm run lint`
- `npm test`

## Supabase Edge Functions

This repo includes Supabase Edge Functions under `supabase/functions/`.

Some functions require an external AI service and expect the following environment variables in the Edge runtime:

- `AI_API_KEY`
- `AI_CHAT_COMPLETIONS_URL`

The canonical API citation links can be configured with:

- `PUBLIC_APP_URL` (preferred) or `CANONICAL_BASE_URL`
