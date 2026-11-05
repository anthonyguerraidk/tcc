import { cleanStart, checkAutoclean, esp } from "../services/esp.js";
import { connected, mapa, average } from "../utils/utils.js";
import {  dbj, dbta, retrievePowerData, updateSettingsData,updateSensorsData,settings} from "../services/database.js";
import { db } from "../config/database.js";
import express from 'express';
const cleanRouter = express.Router();

cleanRouter.post('/clean/start',(req,res)=>{
    cleanStart();
    res.json({ command:`sending command: ${esp.command}`});
    //wait for heartbeat so esp sees the command
})

cleanRouter.get('/powerData', async (req,res)=>{
  let data = await retrievePowerData("a");
  if(!data){
    res.status(404).json({
      error:"no data available"
    })
  }else{
    res.json({data});
  }
})

cleanRouter.post('/settings/update/autoClean',async (req,res)=>{
  Object.assign(settings,req.body);
  //update database settings
  //console.log(settings);
  res.json({msg:"settings updated succesfuly"});
})

export default cleanRouter;