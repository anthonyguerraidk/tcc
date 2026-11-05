import { cleanStart, checkAutoclean, esp } from "../services/esp.js";
import { connected, mapa, average } from "../utils/utils.js";
import { startDB,db } from "../config/database.js";
export let dbj;

export const settings = {
  autoClean:false,
  autoCleanTime:6000,
  autoCleanTrigger:40
}

export const dbta = {
  type:"none",
  connected:false, //connected or not
}


export async function retrievePowerData(a=null){// this commented part here \/ is for when is finally working, it will get the data from the last hour, since its not done and running yet, its not gonna work properly
  let averagePower=0;
  let data = await db.query("select power from sensorReadings where recordedAt >= now() - interval 1 hour and recordedAt <= now() order by recordedAt desc limit 100"); 
  data=data[0]

  if(data.length == 0||data.length==null||data.length==undefined){
    return false;
    //return false;
  }else{
    for(let i=0;i<data.length;i++){
      averagePower=averagePower+Number(data[i].power);
    }
    averagePower=(averagePower/data.length).toFixed(2);
  }

  if(a=="a"||a=="A"||a=="average"||a=="Average"||a==1||a=="1"){
    return averagePower;
  }else if(a==""||a==null||a==undefined||a==0||a=="0"){
    return data;
  }    
}

export async function updateSettingsData(){
  await db.query(`
    
  `)
}


//needa make a function to push the logging data up to the database

export async function updateSensorsData(){
  await db.query(`
    INSERT INTO sensorReadings (
        power,
        dustLevel,
        espStatus,
        commandAck
    )
    VALUES (${esp.power}, ${esp.dustLevel}, '${esp.status}', '${esp.ack}')
`)
}
