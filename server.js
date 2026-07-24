const express = require('express'); //librariessss didnt want to but its practical
const app = express(); //express is kinda useful... at least aint react
const path = require('path'); //importing fs path reader
const PORT = 3000; //port the server will use, may change?
//this esp here holds the last data retrieved from the esp32 
const esp = {
  connected:false,
  lastSeen:0,
  power:0,
  panelsCleaned:0,
  waterUsage:0,
  dustLevel:0,
  waterTank:0,
  pumpRunning:false,
  command:"idle",
  lastCommandAck:"",
  status:"idle"
}

app.use(express.json()); //so express can properly parse json
app.use(express.static('public')); //allowing server access to everything inside public/

//default request ("/")
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

//to start or stop cleaning
app.post('/clean/start',(req,res)=>{
  esp.panelsCleaned+=1;
  esp.command="clean";
  res.json({ command:`sending command: ${esp.command}`});
})

//app.post('/clean/stop',(req,res)=>{
//  esp.command="stop";
//})

//heartbeat, esp32
app.post('/heartbeat',(req,res)=>{
    esp.connected = true;
    esp.lastSeen = Date.now();
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
    
    //send back command
    if(status=="nowCleaning"){
      //...
    }else if(status=="doneCleaning"){
      res.json({ command: "idle"});
    }else{
      res.json({ command: esp.command});
      esp.lastCommandAck=`${esp.command} sent succesfully`
    }
    console.log(esp);
})

//get data
app.get('/data', (req, res) => {
    if(esp.connected==false){
      console.log("eps32 is not connected");
      res.json({connected:false});
    }else{
  res.json({esp});
}
});

setInterval(() => {
    if(esp.command=="cleaning"){
      return;
    }
    if (Date.now() - esp.lastSeen > 6000) {
      esp.connected = false;
      esp.command="idle";
    }
}, 1000);

//run servah :3
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`:3`);
  
});
