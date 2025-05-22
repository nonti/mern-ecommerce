import express from 'express';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.routes.js';
import { connectDB } from './lib/db.js';


const app = express();
const PORT = process.env.PORT || 4000;

// MIDDLEWARES
app.use(express.json());
app.use(cookieParser());

// ROUTES
app.use('/api/auth', authRouter);

// SERVER
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
})