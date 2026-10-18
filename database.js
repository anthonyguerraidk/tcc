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

let database=false;//false=local database, true=actual database

let dbta = {
    status:false,
    tables:0,
    lastSeen:0,
    debugText:"hallo :3"
}

process.argv.forEach(function (val, index, array) {
  if (array.length>2){
    if(array[2]=="db"){
      //start w local database
      database=false;
    }else{
      database=true;
    }
  }else{
    console.log("no argument provided, starting with normal database");
  }

});


if(database){
  const dbj = JSON.parse(
    fs.readFileSync('../db.json', 'utf8')
);
}

let db;
async function startDB(){
  if(database){
    db = await mysql.createConnection({
        host: dbj.host,
        user: dbj.user,
        password: dbj.pass,
        database: dbj.db,
        port: 3306
    });
    console.log("Connected to database!");
    dbta.status=true;
  }else{
    try{
    db = await mysql.createConnection({
        host: "localhost",
        user: "root",
        database:"testDatabase",
        port: 3306,
        password:""
    });    
    }catch(err){
        if(err.errno==1049){
            console.log("\nATTENTION\nno database found in the server, creating a new one in 5 seconds, to cancel press ctrl+c\n");
            setTimeout(async function(){
                let tempdb = await mysql.createConnection({
                    host: "localhost",
                    user: "root",
                    password:""
                }); 

                try {
                    let wholeNewDatabaseQuery=fs.readFileSync('databaseTemplate.txt', 'utf8')
                    //console.log(wholeNewDatabaseQuery);
                    await tempdb.query(wholeNewDatabaseQuery);
                } finally {
                  await tempdb.end(); // Closes the connection
                }

            },5000);
        }else{
            throw err;
        }
    }    
  }
}

app.use(cors({
  origin: "http://localhost:"+PORT,
}));
app.use(express.json()); 
app.use(express.static(path.join(__dirname,'public')));

app.get('/', (req, res) => {res.sendFile(path.join(__dirname, 'public', 'privateIndex.html'));});

app.get('/data', async (req, res) => {
    const [rows] = await db.query("SHOW TABLES");
    //console.log(rows);
    res.json(rows);

});

app.get('/createDefaultDatabase',async(req,res)=>{
    createDatabase();
})

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


