import express from 'express';
import path from 'path';
import 'dotenv/config';
import { fileURLToPath } from 'url';
import fs from 'fs';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import { cleanStart, checkAutoclean, esp } from "./services/esp.js";
import { connected, mapa, average } from "./utils/utils.js";
import {  dbj, dbta, retrievePowerData, updateSettingsData,updateSensorsData,settings} from "./services/database.js";
import { startDB,db } from "./config/database.js";

import dataRouter from './routes/data.js';
import cleanRouter from './routes/clean.js';

const port = process.env.PORT;

export const app = express(); 

app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

app.use('/', dataRouter);
app.use('/', cleanRouter);

app.get('/', (req, res) => {res.sendFile(path.join(__dirname, '../frontend/index.html'));});

checkAutoclean();
    try {
        await startDB();
            app.listen(port, () => {
                console.log(`\n:3\n`);
            });
    } catch (error) {
        console.error('Could not start server:', error);
        process.exit(1);
    }


