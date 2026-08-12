# GPT RAG — Multi-Agent AI Chat Platform

A ChatGPT-style app where each message is routed to one of several specialised AI
agents (chat, web-search, coding, PDF-RAG, image generation, and more).

## Structure

```
.
├── frontend/   # React 19 + Vite SPA (deployed on Vercel)
└── backend/    # Node/Express — gateway + auth + chat + agent services
```

## Running locally

**Frontend**
```bash
cd frontend
npm install
npm run dev
```

**Backend** (single process — see `backend/DEPLOY.md` for the full setup)
```bash
cd backend
npm install
npm start
```

## Deployment

- **Frontend:** Vercel (Root Directory = `frontend`)
- **Backend:** any Node host / Render (Root Directory = `backend`) — see [`backend/DEPLOY.md`](backend/DEPLOY.md)

Environment variables are documented in `backend/.env.example`. Secrets (`.env`,
`serviceAccountKey.json`) are gitignored and must be set on the host directly.
