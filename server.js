const express = require('express'); //librariessss didnt want to but its practical
const app = express(); //express is kinda useful... at least aint react
const path = require('path'); //importing fs path reader
const PORT = 3000; //port the server will use, may change?
const cors = require('cors');
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
  lastCommandAck:"",//command feedback
  status:"idle"     //current command running
}

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

//maybe ill work on this?
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
      pumpRunning
    } = req.body;
      
    //set values
    esp.power=power;
    esp.dustLevel=dustLevel;
    esp.waterTank=waterTank;
    esp.pumpRunning=pumpRunning;
    esp.status=status;
    
    //send command back to esp
    if(status=="nowCleaning"){
      esp.lastSeen = Date.now();
      console.log("cleaning");
    }else if(status=="doneCleaning"){
      esp.panelsCleaned+=1;
      res.json({ command: "idle"});
    }else{
      res.json({ command: esp.command});
      esp.lastCommandAck=`${esp.command} sent succesfully`
    }

    //console.log(esp);
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

function report(){
  return esp;
}

//loop to check if the esp is still connected, timeout postponed if cleaning
setInterval(() => {
    console.log(report())//console report
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
