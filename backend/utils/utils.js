import { cleanStart, checkAutoclean, esp } from "../services/esp.js";
import {  dbj, dbta, retrievePowerData, updateSettingsData,updateSensorsData,settings} from "../services/database.js";
import { db } from "../config/database.js";
import { app } from "../server.js";

export let connected = false;

export function average(){
  let x;
  for(i=0;i=powerAverage.length;i++){
    x+i;
  }
  x=(x/powerAverage.length);
  console.log(x);
  return x;
}

export function mapa(value, inMin, inMax, outMin, outMax) {
    return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}
