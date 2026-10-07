const express = require('express'); //librariessss didnt want to but its practical
const app = express(); //express is kinda useful... at least aint react
const path = require('path'); //importing fs path reader
const PORT = 3000; //port the server will use, may change?
const cors = require('cors');
const mysql = require('mysql2');
const fs = require('fs');
//this esp here holds the last data retrieved from the esp32 
let connected = false;
const esp = {
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
      //start w database
    }else if(array[2]=="no"){
      //start ohne database
    }else{
      console.log("invalid argument >w<");
      process.exit(code)
    }
  }else{
    console.log("provide an argument pls ;3");
    process.exit();
  }

});

//for security reasons, the database info will be taken outta there
const dbj= JSON.parse(fs.readFileSync('../db.json','utf8')); //get the database data from a file outside the project
  const db = mysql.createConnection({
    host: dbj.host,
    user: dbj.user,
    password: dbj.pass,
    database: dbj.db,
    port: 3306 //? idk wich port to use, this the default innit?
});
db.connect((err) => {
    if (err) {
        console.error("Database connection failed:");
        console.error(err);
        return;
    }
    console.log("Connected to database!");
    
});

//let log="";
let powerAverage=[];

app.use(cors({
  origin: "http://localhost:3000",
}));//setup cors, what a pain in my ass eh
app.use(express.json()); //so express can properly parse json
app.use(express.static('public')); //allowing server access to everything inside public/

//default request ("/")
app.get('/', (req, res) => {res.sendFile(path.join(__dirname, 'index.html'));});

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
    connected = true;
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
    powerAverage.push(power);
    
    //BEHOLD!! DEBUGG!!

    //console.log(esp);

    //
})

//get data
app.get('/data', (req, res) => {
    if(connected==false){
      console.log("eps32 is not connected");
      res.json({connected});
    }else{
    res.json({connected, esp});
}
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
      connected = true;
      esp.lastSeen = Date.now();
    }else if(Date.now() - esp.lastSeen > 6000) {
      connected = false;
      esp.command="idle";
    }
}, 1000);

//run servah :3
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`:3`);
  
});
