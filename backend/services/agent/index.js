import 'dotenv/config';
import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import router from './routes/agent.route.js';


const app = express();
app.use(express.json());
app.use('/',router);

app.use((err, req, res, next) => {
  console.log(err);

  if (err.status) {
    return res.status(err.status).json(err.data);
  }

  return res.status(500).json({
    message: `agent error ${err}`,
  });
});

const PORT = process.env.PORT;

app.get('/', (req, res) => {
  res.send('Hello from the agent service!');
});

app.listen(PORT, () => {
  console.log(`Agent service is running on port ${PORT}`);
  connectDB();
});