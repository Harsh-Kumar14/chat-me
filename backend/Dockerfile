# Simple single-process image for the whole backend.
# (Optional — Render can also build this app directly with no Docker.)
FROM node:22-slim

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY . .

EXPOSE 8000

CMD ["node", "server.js"]
