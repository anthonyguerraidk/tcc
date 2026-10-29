import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import mysql from 'mysql2/promise';
import fs from 'fs';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = 3000;
const app = express(); 

let WhichDatabase=false;//false=local database, true=actual database
let dbta = {
  type:"none",
  connected:false, //connected or not

}
let dbj;

let connected = false;
const esp = {
  connected:false,
  lastSeen:0,       //last seen
  power:0,          //in volts, current voltage
  panelsCleaned:0,  //times cleaning has been triggered/pannels cleaned
  waterUsage:0,     //water usage, as of now unused
  dustLevel:0,      //dirt level, calculated from voltage input
  waterTank:0,      //water remaining for usage, probably to be removed
  pumpRunning:false,//pump boolean
  command:"idle",   //last command sent
  ack:"...",        //command feedback
  status:"idle"     //current command running
}


//process the arguments, supposedly the password goes there
process.argv.forEach(function (val, index, array) {
  if (array.length>2){
    if(array[2]=="db"){
      WhichDatabase=false;
    }else{
      WhichDatabase=true;
    }
  }else{
    WhichDatabase=true;
    console.log("no argument provided, starting with normal database");
  }

});

//for security reasons, the database info will be taken outta there
if(WhichDatabase){
  dbj = JSON.parse(
    fs.readFileSync('../db.json', 'utf8')
);
}


let db;

//fix this to create a database and tables separately so it works fine with noraml and local databse
async function createTables(){
    console.log("creating database in 5 seconds, press Ctrl + C to cancel")
        setTimeout(async function(){
                //let tempdb = await mysql.createConnection({
                //    host: "localhost",
                //    user: "root",
                //    password:""
                //}); 
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
                        await db.query(statement);
                    }
                    
                    //await tempdb.query(wholeNewDatabaseQuery);
                    console.log('Database created OwO');
                    console.log("runnin now :3")
                }catch(err){
                    console.log(err);
                }
                // finally {
                //  await tempdb.end(); // Closes the connection
                //}
            },5000);
}

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
            createTables();
        }
        return;
    }
    console.log("Connected to local database!");
      dbta.connected=true;
      dbta.type="local";
}

async function startDB(){
try{
  if(WhichDatabase){
    console.log("\nattempting connection to normal database")
    try{
      db = await mysql.createConnection({
          host: dbj.host,
          user: dbj.user,
          password: dbj.pass,
          database: dbj.db,
          port: 3306
      });
    }catch(err){
      console.log("connection to local databse failed")
      console.log(err);
      return;
    }
      console.log("Connected to normal database!");
      dbta.connected=true;
      dbta.type="normal";
  }else{
    console.log("\nattempting connection to normal database")
    try{
      await localDatabase();
    }catch(err){
      console.log("connection to local databse failed")
      console.log(err);
    }
  }

}catch(err){
  console.log("CRITCAL ERROR, some problem connecting to database(s)")
  console.log(err)
  process.exit;
}

try{
  let query = await db.query("show tables")
  query=query[0];
  if(query==undefined||query==null||query==0){
    console.log("\nno tables found in the database,")
    createTables();
  }else if(query.length!=5){
    console.log("some tables are missing, fixing database")
    restoreDatabase();
  }else{
    console.log("Database verified, all fine")
  }
}catch(err){
  console.log(err);
}

}

app.use(cors({
  origin: "http://localhost:"+PORT,
}));
app.use(express.json());
app.use(express.static(path.join(__dirname,'public')));
app.get('/', (req, res) => {res.sendFile(path.join(__dirname, 'public', 'publicIndex.html'));});

//to start or stop cleaning
app.post('/clean/start',(req,res)=>{
    esp.command="clean";
    //esp.status="cleaning"
    console.log("starting to clean")
    res.json({ command:`sending command: ${esp.command}`});
    //wait for heartbeat so esp sees the command
})

//this gotta update very x y, i was thinking every minute, but too much innit?, every hour?
//the average count must run every minute, but its too much... useless data
app.post('/update',(req,res)=>{
  //average();
  //database connection here, upload data
})

//maybe ill work on this later?
//app.post('/clean/stop',(req,res)=>{
//  esp.command="stop";
//})

//database code too, update and stuff, requires a login system

//heartbeat... basically constant communication between esp and server
app.post('/heartbeat',(req,res)=>{
    esp.connected = true;
    esp.lastSeen = Date.now();
    
    //process data from esp
    const {
      power, 
      dustLevel,
      waterTank,
      command,
      status,
      ack,
      pumpRunning
    } = req.body;

    //set values
    esp.power=power;
    esp.dustLevel=dustLevel;
    esp.waterTank=waterTank;
    esp.pumpRunning=pumpRunning;
    esp.status=status;
    esp.ack=ack;
    //send command back to esp
    if(status=="nowCleaning"){
      esp.lastSeen = Date.now();
      console.log("cleaning");
    }else if(status=="doneCleaning"){
      console.log("done cleaning");
      esp.panelsCleaned+=1;
      esp.command="idle";
    }else{
      res.json({ command: esp.command});
    }
      
//i forgor how to use lists lollllll, heres the functions:
//push(), pop(), shift(), unshift(), map(), filter(), forEach(), reduce(), sort(), and slice().
    
    //BEHOLD!! DEBUGG!!

    //console.log(esp);

    //
})

//get data
app.get('/data', (req, res) => {
    res.json({esp,dbta});
});

app.get('/logs', (req, res) => {
    let logData=db.query("select * in logs");

    res.json(logData);
});

function average(){
  let x;
  for(i=0;i=powerAverage.length;i++){
    x+i;
  }
  x=(x/powerAverage.length);
  console.log(x);
  return x;
}

function report(){
  return esp;
}

//update database function

//loop to check if the esp is still connected, timeout postponed if cleaning
setInterval(() => {
    //console.log(report())//console report
    if(esp.status=="nowCleaning"){
      esp.connected = true;
      esp.lastSeen = Date.now();
    }else if(Date.now() - esp.lastSeen > 6000) {
      esp.connected = false;
      esp.command="idle";
    }
}, 1000);

setInterval(function(){

},10000);

//run servah :3
// replace your current app.listen block with:
startDB().then(() => {
    app.listen(PORT, () => {
        console.log(`\nServer running on http://localhost:${PORT}`);
        console.log(`\n:3\n`);
    });
});
