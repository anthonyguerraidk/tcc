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
let dbj;
let dbta = {
    status:false,
    tables:0,
    lastSeen:0,
    debugText:"hallo :3"
}

process.argv.forEach(function (val, index, array) {
  if (array.length>2){
    if(array[2]=="db"){
      database=false;
    }else{
      database=true;
    }
  }else{
    console.log("no argument provided, starting with normal database");
    database=true;
  }

});

if(database){
  dbj = JSON.parse(
    fs.readFileSync('../db.json', 'utf8')
);
}

let db;

async function localDatabase(){
    try{
        console.log("connecting to localDatabase")
        db = await mysql.createConnection({
            host: "localhost",
            user: "root",
            database:"testDatabase",
            port: 3306,
            password:""
    });    
    }catch(err){
        if(err.errno==1049){
            console.log("database was not found, creating a new");
            createDatabase();
        }
    }
}

async function createDatabase(){
    console.log("creating database in 5 seconds, press Ctrl + C to cancel")
        setTimeout(async function(){
                let tempdb = await mysql.createConnection({
                    host: "localhost",
                    user: "root",
                    password:""
                }); 

                try {
                    let wholeNewDatabaseQuery=fs.readFileSync('databaseTemplate.txt', 'utf8')
                    
                     const cleanedSql = wholeNewDatabaseQuery
                        .split(/\r?\n/)
                        .filter(line => !line.trim().startsWith('--'))
                        .join('\n');

                     const statements = cleanedSql
                        .split(';')
                        .map(statement => statement.trim())
                        .filter(statement => statement.length > 0);

                     for (const statement of statements) {
                        await tempdb.query(statement);
                    }
                    
                    //await tempdb.query(wholeNewDatabaseQuery);
                    console.log('Database created OwO');
                    console.log("runnin now :3")
                }catch(err){
                    console.log(err);
                } finally {
                  await tempdb.end(); // Closes the connection
                }
            },5000);
    }


async function startDB(){
  if(database){
    console.log("connecting to 'real' database")
    try{
        db = await mysql.createConnection({
        host: dbj.host,
        user: dbj.user,
        password: dbj.pass,
        database: dbj.db,
        port: 3306
    });
    console.log("Connected to database!");
    dbta.status=true;
    }catch(err){
        console.log("error in connecting to real database, terminating program");
        console.log(err);
        process.exit();
    }
  }else{
    console.log("starting local database")
    localDatabase();
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

/////////////////////////////////////////////////////////////////////////////////
//review this code whole//

app.get('/userAuth/:part/:name', async (req, res) => {
    const { part, name } = req.params;

    try {
        if (part === 'name') {
            const result = await db.query('select * from users where name = ?',[name])[0];
            
            /*
            if(result.rows===undefined||result.rows===null){
                return res.status(404).json({
                    message: 'User not found, undefined'
                });
            }
            */

            if (result.rows.length === 0) {
                return res.status(404).json({
                    message: 'User not found, 0 rows'
                });
            }

            return res.status(200).json({
                message: 'User found',
                valid:true,
                user: result.rows[0]
            });

        } else if (part === 'pass') {
            // Implement password verification here.
            return res.status(501).json({
                message: 'Password verification not implemented'
            });

        } else {
            return res.status(400).json({
                message: 'Invalid part. Use "name" or "pass".'
            });
        }
    } catch (error) {
        console.error('Authentication error:', error);

        return res.status(500).json({
            message: 'Internal server error'
        });
    }
});

//review this code whole//
/////////////////////////////////////////////////////////////////////////////////

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


