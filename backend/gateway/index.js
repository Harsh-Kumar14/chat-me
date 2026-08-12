import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import proxy from 'express-http-proxy';

import cors from 'cors';
import cookieParser from 'cookie-parser';
import protect from './middleware/auth.middleware.js';
import { getCurrentUser } from './controllers/user.controller.js';
import { proxyWithHeaders } from './utils/proxyWithHeaders.js';


const app = express();
const PORT = process.env.PORT;

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

app.use(cookieParser());

app.use('/api/auth',proxy(process.env.AUTH_SERVICE_URL));
app.use('/api/chat',protect,proxyWithHeaders(process.env.CHAT_SERVICE_URL));
app.use('/api/agent',protect,proxyWithHeaders(process.env.AGENT_SERVICE_URL));

app.get("/api/me",protect,getCurrentUser)

app.get('/', (req, res) => {
  res.send('Hello from the gateway!');
});


app.listen(PORT, () => {
  console.log(`Gateway is running on port ${PORT}`);
});