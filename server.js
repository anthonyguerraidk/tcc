const express = require('express'); //librariessss didnt want to but its practical
const app = express(); //express is kinda useful... at least aint react
const path = require('path'); //importing fs path reader
const PORT = 3000; //port the server will use, may change?
const esp = {
  connected:false,
  lastSeen:0,
  power:0,
  panelsCleaned:0,
  waterUsage:0,
  dustLevel:0,
  waterTank:0,
  pumpRunning:false,
  command:"idle"
}
app.use(express.json());
app.use(express.static('public')); //allowing server access to everything inside public/

//default request ("/")
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

//heartbeat, esp32
app.post('/heartbeat',(req,res)=>{
    esp.connected = true;
    esp.lastSeen = Date.now();

  const {
        power, 
        dustLevel,
        waterTank,
        pumpRunning
    } = req.body;
    
    //set values
    esp.power=power;
    esp.dustLevel=dustLevel;
    esp.waterTank=waterTank;
    esp.pumpRunning=pumpRunning;
    
    //send back command
      res.json({ command: "idle" });
})

//get data, to be worked
app.get('/data', (req, res) => {
    if(esp.connected==false){
      console.log("eps32 is not connected");
      res.json({connected:false});
    }else{
  res.json({
    esp,
    status: 'ok'
  });
}
});

//post commands, to be worked
//esp32 will send posts as requests for instructions each second and to send data
//data which will be saved and sent on /data, make disconnection detection too
app.post('/echo', (req, res) => {
  res.json({
    received: req.body
  });
});

setInterval(() => {
    if (Date.now() - esp.lastSeen > 5000) {
        esp.connected = false;
    }
}, 1000);

//run servah :3
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`:3`);
  
});
