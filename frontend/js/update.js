import {genDB,genESP32,enBtns,disBtns,cleanDown,autoClean} from "./page.js";
import {dataAvailable} from "./main.js";
import {API} from "./api.js";

        //if you put a getInfo() in this function you create a bomb
        export async function updateSettings(){
         const response = await fetch(`${API}/settings/update/autoClean`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "autoClean":autoClean,
                "autoCleanTime":60000,//dummy data, implement later
                "autoCleanTrigger":40
            })
        });
        }

        //if you put a getInfo() in this function too, you also create a bomb
        export function updateValues(esp){
                document.getElementById("panelsCleaned").innerText = esp.panelsCleaned;
                document.getElementById("waterUsage").innerText = `${esp.waterUsage}L`;
                document.getElementById("voltageInput").innerText = `${esp.power}V`;
                document.getElementById("dustLevel").innerText = esp.dustLevel;
                document.getElementById("waterTank").innerText = `${esp.waterTank}%`;
        
                const pump = document.getElementById("pumpStatus");
                pump.innerText = esp.pumpStatus ? "Active" : "Stopped";
                pump.style.color = esp.pumpStatus ? "green" : "red";
                document.getElementById("autoMode").checked = autoClean;
                //console.log(`currently: ${esp.command}`)
                updateSettings();
        }


