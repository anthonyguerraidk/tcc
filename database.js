import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import mysql from 'mysql2/promise';
import fs from 'fs';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = 3001;
const app = express();

let dbta = {
    tables:0,
    lastSeen:0,
    debugText:"hallo :3"
}

const dbj = JSON.parse(
    fs.readFileSync('../db.json', 'utf8')
);

let db;
async function startDB(){
    db = await mysql.createConnection({
        host: dbj.host,
        user: dbj.user,
        password: dbj.pass,
        database: dbj.db,
        port: 3306
    });
    console.log("Connected to database!");
}

app.use(cors({
  origin: "http://localhost:3001",
}));
app.use(express.json()); 
app.use(express.static('private'));
app.get('/', (req, res) => {res.sendFile(path.join(__dirname, 'index.html'));});

app.get('/data', async (req, res) => {
    const [rows] = await db.query("SHOW TABLES");
    //console.log(rows);
    res.json(rows);

});

app.get('/info', async (req, res) => {
    res.json(dbta);
});

app.listen(PORT, () => {
    startDB().catch((err) => {
    console.error("Database error:", err);
});
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`:3`);
  
});


