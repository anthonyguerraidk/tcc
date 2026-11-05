import { cleanStart, checkAutoclean, esp } from "../services/esp.js";
import { connected, mapa, average } from "../utils/utils.js";
import {  dbj, dbta, retrievePowerData, updateSettingsData,updateSensorsData,settings} from "../services/database.js";
import { db } from "../config/database.js";
setInterval(checkAutoclean,settings.autoCleanTime);
setInterval(() => {
    if(esp.status=="nowCleaning"){
      esp.connected = true;
      esp.lastSeen = Date.now();
    }else if(Date.now() - esp.lastSeen > 6000) {
      esp.connected = false;
      esp.command="idle";
    }
}, 1000);

//debug
//setInterval(function(){
//  console.log(esp);
//  console.log(dbta);
//  console.log(settings);
//},5000)