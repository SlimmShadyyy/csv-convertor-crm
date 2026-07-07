// 1. THIS MUST BE AT THE VERY TOP
import dotenv from 'dotenv';
dotenv.config();

// 2. Now import everything else
import express from 'express';
import cors from 'cors';
import { processCsvBatch } from './controllers/csvController';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

app.post('/api/process-csv', processCsvBatch);

app.listen(PORT, () => {
  console.log(`🚀 GrowEasy Extraction API running on port ${PORT}`);
});