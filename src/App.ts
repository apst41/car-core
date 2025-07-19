import express, { Application } from 'express';
import dotenv from 'dotenv';
import router from './routes/Routes';
import partnerRouter from "./routes/PartnerRoutes";

dotenv.config();

const app: Application = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api', router);

app.use("/partner",partnerRouter);


export default app;
