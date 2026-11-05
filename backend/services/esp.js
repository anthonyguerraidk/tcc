import { connected, mapa, average } from "../utils/utils.js";
import {  dbj, dbta, retrievePowerData, updateSettingsData,updateSensorsData,settings} from "../services/database.js";
import { db } from "../config/database.js";
import { app } from "../server.js";

export const esp = {
  connected:false,
  lastSeen:0,       //last seen...
  power:0,          //in volts, current voltage
  panelsCleaned:0,  //times cleaning has been triggered/pannels cleaned
  waterUsage:0,     //water usage, as of now unused
  dustLevel:0,      //dirt level, calculated from voltage input
  waterTank:0,      //water remaining for usage, probably to be removed
  command:"idle",   //last command sent
  ack:"...",        //command feedback
  status:"idle"     //current command running
}


export async function cleanStart(){
  esp.command="clean";
  console.log("starting to clean");
}

//autoclean
export async function checkAutoclean(){
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
      //console.log("pannel is dirty, autoClean is off")
    }  
  }
}