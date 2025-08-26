# Shindo-API (Vercel, Next.js + TypeScript)

API pública para o **Shindo Client**, hospedável na **Vercel**. Mantém **Next.js** (pages router) e expõe:
- `GET /api/handshake` — Health check (inclui teste opcional no Firestore).
- `GET /api/config` — Config pública (inclui `wsUrl`).
- `GET /api/connected-users` — Proxy para o **WS Gateway** (`/v1/connected-users`).
- `POST /api/broadcast` — Proxy admin para o **WS Gateway** (`/v1/broadcast`).

## Rodar localmente
```bash
npm i
npm run dev
# http://localhost:3000
```
