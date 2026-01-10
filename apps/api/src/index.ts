import express from 'express';
import cors from 'cors';
import { HealthCheckResponse } from '@repo/shared';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
    const response: HealthCheckResponse = {
        status: 'ok',
        timestamp: new Date().toISOString(),
    };
    res.json(response);
});

app.listen(port, () => {
    console.log(`API running on port ${port}`);
});
