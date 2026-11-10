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

//define variables
let WhichDatabase=false;//false=local database, true=actual database (idk what to call it)
let db; //stores database data
//let connected = false; //check whether... idk actually, think its deprecated
let debug = false; //dis(en)ables debug

const settings = { //autoClean settings
  autoClean:false, //autoclean toggle
  autoCleanTime:60000, //time autoClean is triggered
  autoCleanTrigger:40 //dirtyness percentage for autoclean to be triggered
}

const esp = { //variable that holds esp-related data
  connected:false, //if esp is connected
  lastSeen:0,       //last it was seen... (in Date.now())
  power:0,          //in volts, current voltage output from the solar pannel
  panelsCleaned:0,  //times cleaning has been triggered/pannels cleaned
  waterUsage:0,     //water usage, not used
  dustLevel:0,      //dirt level, calculated from voltage input and pannel power output reference (12v)
  waterTank:0,      //water remaining for usage, not used
  command:"idle",   //last command sent
  ack:"...",        //command feedback
  status:"idle"     //current command running
}

const dbta = { //database data
  type:"none", //which type of database it is
  connected:false, //if the database is connected or not
}


//process file exec arguments:
process.argv.forEach(function (val, index, array) {
  if (array.length>2){
    //if first argument after file execution is db, start local database
    if(array[2].toLowerCase()=="db"){ 
      WhichDatabase=false;
    }else{ //else, start normal database
      WhichDatabase=true;
    }
    //if first or second argument after file executor is debug, else start normal database
    if(array[2].toLowerCase()=="debug"||array[3].toLowerCase()=="debug"){
      console.log("debug enabled");
      debug=true;
    }
  }else{
    WhichDatabase=true;
    console.log("no argument provided, starting with normal database");
  }
});


//reads the file containing database info, should be an .env, isn't...
if(WhichDatabase){
  dbj = JSON.parse(
    fs.readFileSync('../db.json', 'utf8')
);
}

//just like cpp's 'map()' function, useful
function mapa(value, inMin, inMax, outMin, outMax) {
    return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}

//returns thea verage of the powerAverage, specifically
function average(){
  let x;
  for(i=0;i=powerAverage.length;i++){
    x+i;
  }
  x=(x/powerAverage.length);
  console.log(x);
  return x;
}


//manage databases, create/fix tables, start local/normal database, etc
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

//starts local database with default settings for xampp
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

//connect to normal database, variable name should match 'localDatabase'... wont change it tho
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
      console.log("connection to normal databse failed")
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


//needa make a function to push the logging data up to the database...


//retrieve data
async function retrievePowerData(a=null){// this commented part here \/ is for when is finally working, it will get the data from the last hour, since its not done and running yet, its not gonna work properly
  let averagePower=0;
  let data = await db.query("select power from sensorReadings where recordedAt >= now() - interval 1 hour and recordedAt <= now() order by recordedAt desc limit 100"); 
  data=data[0]

  if(data.length == 0||data.length==null||data.length==undefined){
    return false;
    //return false;
  }else{
    for(let i=0;i<data.length;i++){
      averagePower=averagePower+Number(data[i].power);
    }
    averagePower=(averagePower/data.length).toFixed(2);
  }

  if(a=="a"||a=="A"||a=="average"||a=="Average"||a==1||a=="1"){
    return averagePower;
  }else if(a==""||a==null||a==undefined||a==0||a=="0"){
    return data;
  }    
}


//update data
async function updateSettingsData(){
  await db.query(`
    insert into 
  `)
}

async function updateSensorsData(){
  await db.query(`
    INSERT INTO sensorReadings (
        power,
        dustLevel,
        espStatus,
        commandAck
    )
    VALUES (${esp.power}, ${esp.dustLevel}, '${esp.status}', '${esp.ack}')
`)
}


//clean command
async function cleanStart(){
  esp.command="clean";
  console.log("starting to clean");
}

//autoclean function, checks if its enabled, and if so, manages autoclean
async function checkAutoclean(){
  if(!esp.connected){
    console.log("auto clean unavailable, esp disconnected");
    return;
  }
  let a = await retrievePowerData();
  a=a[0].power;
  esp.dustLevel = (100-mapa(a,0,13,0,100)).toFixed(2);
  if(a===false){
    console.log("no sensor data available for autoclean");
    return;
  }
  if(esp.dustLevel>settings.autoCleanTrigger){
    if(settings.autoClean){
      cleanStart();
      console.log("autoclean Triggered");
    }else {
      console.log("pannel is dirty, autoClean is off")
    }  
  }
}


//express settings
app.use(cors({
  origin: "http://localhost:"+PORT,
}));
app.use(express.json());
app.use(express.static(path.join(__dirname,'public')));
app.get('/', (req, res) => {res.sendFile(path.join(__dirname, 'public', 'publicIndex.html'));});


//routes
//triggers esp clean routine
app.post('/clean/start',(req,res)=>{
    cleanStart();
    res.json({ command:`sending command: ${esp.command}`});
    //wait for heartbeat so esp sees the command
})

//retrieves the power data from database
app.get('/powerData', async (req,res)=>{
  let data = await retrievePowerData("a");
  if(!data){
    res.status(404).json({
      error:"no data available"
    })
  }else{
    res.json({data});
  }
})

//SHOULD update settings database so user preferences are saved...
app.post('/settings/update/autoClean',async (req,res)=>{
  Object.assign(settings,req.body);
  //update database settings
  console.log(settings);
  res.json({msg:"settings updated succesfuly"});
})

//most important function, it runs every few seconds, requested by the esp, keeps the esp alive('connected'), 
//updates the 'esp' variable with new data
//updates the frontEnd too
app.post('/heartbeat',(req,res)=>{
    esp.connected = true;
    esp.lastSeen = Date.now();
    const {
      power, 
      command,
      status,
      ack,
    } = req.body;

    esp.power=power;
    esp.status=status;
    esp.ack=ack;

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
    updateSensorsData();
})

//retrieves and sends back to frontend data it needs
app.get('/data', (req, res) => {
    res.json({esp,dbta});
});

//retrieves logs from database, only dummy data there as of now
app.get('/logs', async (req, res) => {
    let logData=await db.query("select * from maintenanceLogs");
    res.json(logData);
});

//interval to check if its still cleaning, so its not considered as disconnected or smth 
setInterval(() => {
    if(esp.status=="nowCleaning"){
      esp.connected = true;
      esp.lastSeen = Date.now();
    }else if(Date.now() - esp.lastSeen > 6000) {
      esp.connected = false;
      esp.command="idle";
    }
}, 1000);


//autoCleans every x (time defined at... \/ (here))
setInterval(checkAutoclean,settings.autoCleanTime);

//debug:
setInterval(function(){if(debug){
  console.log(esp);
  console.log(dbta);
  console.log(settings);
}},5000)


//starts whole server, anything done after this is not executed (app.listen())
startDB().then(() => {
  checkAutoclean();
    app.listen(PORT, () => {
        console.log(`\nServer running on http://localhost:${PORT}`);
        console.log(`\n:3\n`);
    });
});
