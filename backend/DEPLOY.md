# Deploying the backend for free (Render)

Your backend now runs as **one process** (`server.js`) instead of 4 separate
services. Same code, same routes — just one thing to deploy. This makes it fit
comfortably on a free tier.

**Target: $0/month** — replaces the AWS Fargate setup that was draining credits.

---

## 1. Move the databases to free tiers

Create these three (all have permanent free plans) and copy each connection string:

| Service | Sign up at | You get | Env var |
|---|---|---|---|
| **MongoDB Atlas** | mongodb.com/atlas | Free M0 (512 MB) | `MONGO_URI` |
| **Upstash Redis** | upstash.com | Free serverless Redis | `REDIS_URL` (use the `rediss://` URL) |
| **Qdrant Cloud** | cloud.qdrant.io | Free 1 GB cluster | `QDRANT_URL`, `QDRANT_API_KEY` |

> If you were already using MongoDB Atlas, keep it. Only Redis + Qdrant need moving off AWS.

---

## 2. Push the backend to GitHub

Render deploys from a GitHub repo. Make sure the **`backend`** folder is in a repo,
and confirm secrets are ignored (a `.gitignore` is now included):

```bash
git status   # should NOT list .env or serviceAccountKey.json
```

If `serviceAccountKey.json` was committed before, remove it from tracking:

```bash
git rm --cached services/auth/serviceAccountKey.json
git commit -m "stop tracking firebase secret"
```

---

## 3. Create the Render service

1. Go to **render.com → New → Web Service**, connect your repo.
2. Settings:
   - **Root Directory:** `backend`  (if your repo root is the whole project)
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** Free
3. Add the **Firebase secret file**: in the service's **Environment → Secret Files**,
   add a file at path `services/auth/serviceAccountKey.json` and paste your key's
   JSON contents. (This keeps it out of Git.)

---

## 4. Add environment variables

In Render → **Environment**, add everything from `.env.example`:

```
PORT=8000
FRONTEND_URL=https://your-frontend.vercel.app
MONGO_URI=...
REDIS_URL=...
QDRANT_URL=...
QDRANT_API_KEY=...
GROQ_API_KEY=...
GOOGLE_API_KEY=...
OPENROUTER_API_KEY=...
TAVILY_API_KEY=...
AWS_REGION=ap-south-1        # only if using S3
AWS_ACCESS_KEY_ID=...        # only if using S3
AWS_SECRET_KEY=...           # only if using S3
```

Deploy. When it's live you'll get a URL like `https://your-backend.onrender.com`.

---

## 5. Point the frontend at the new URL

In **Vercel → your frontend project → Settings → Environment Variables**, set:

```
VITE_SERVER_URL = https://your-backend.onrender.com
```

Redeploy the frontend.

---

## 6. Only now, shut down AWS

Once the Render URL works end-to-end (log in, send a message):

- Delete the **ECS / Fargate** service (this is what was billing you 24/7)
- Delete the **API Gateway** in front of it

Your credit drain stops.

---

## Good to know

- **Cold starts:** the free Render service sleeps after ~15 min idle and takes
  ~30–50s to wake on the first request. Before a demo/interview, open the URL once
  to warm it up.
- **Firebase auth domain:** in the Firebase console → Authentication → Settings →
  Authorized domains, make sure your Vercel domain is listed.
- **Cookies cross-origin:** already handled — the session cookie is
  `SameSite=None; Secure`, which is required for Vercel ↔ Render.
- **Qdrant Cloud needs an API key.** If the PDF/RAG agent fails to connect, add the
  key in `services/agent/config/vectorDb.js`:
  ```js
  return await QdrantVectorStore.fromDocuments(docs, embeddings, {
    url: process.env.QDRANT_URL,
    apiKey: process.env.QDRANT_API_KEY,   // add this line for Qdrant Cloud
    collectionName,
  });
  ```

## Interview soundbite

> "I built it as separate microservices to learn the pattern and isolate concerns.
> For the hosted demo I consolidated them into a single deployment to fit a free
> tier and remove chained cold-start latency — a deliberate cost/performance
> trade-off. The service code stayed modular, so I can split them back out to scale
> independently if traffic ever justified it."
