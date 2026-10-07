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
}));//setup cors, what a pain in my ass eh
app.use(express.json()); //so express can properly parse json
app.use(express.static('private')); //allowing server access to everything inside public/

//default request ("/")
app.get('/', (req, res) => {res.sendFile(path.join(__dirname, 'index.html'));});

app.get('/data', async (req, res) => {
    const [rows] = await db.query("SHOW TABLES");
    //console.log(rows);
    res.json(rows);

});

app.listen(PORT, () => {
    startDB().catch((err) => {
    console.error("Database error:", err);
});
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`:3`);
  
});


