const express = require('express'); //librariessss didnt want to but its practical
const app = express(); //express is kinda useful... at least aint react
const path = require('path'); //importing fs path reader
const PORT = 3000; //port the server will use, may change?

app.use(express.static('public')); //allowing server access to everything inside public/

//default request ("/")
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

//get data, to be worked
app.get('/data', (req, res) => {
  res.json({
    status: 'ok'
  });
});

//post commands, to be worked
//esp32 will send posts as requests for instructions each second and to send data
//data which will be saved and sent on /data, make disconnection detection too
app.post('/echo', (req, res) => {
  res.json({
    received: req.body
  });
});

//run servah :3
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`:3`);
  
});