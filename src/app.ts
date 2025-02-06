import express, { Application } from 'express';
import dotenv from 'dotenv';
import router from './routes/Routes';

dotenv.config();

const app: Application = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api', router);

export default app;
