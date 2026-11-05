import { cleanStart, checkAutoclean, esp } from "../services/esp.js";
import { connected, mapa, average } from "../utils/utils.js";
import {  dbj, dbta, retrievePowerData, updateSettingsData,updateSensorsData,settings} from "../services/database.js";
import { db } from "../config/database.js";
import express from "express";
const dataRouter = express.Router();

dataRouter.post('/heartbeat',(req,res)=>{
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

dataRouter.get('/data', (req, res) => {
    res.json({esp,dbta});
});

dataRouter.get('/logs', async (req, res) => {
    let logData=await db.query("select * from maintenanceLogs");
    res.json(logData);
});

export default dataRouter;