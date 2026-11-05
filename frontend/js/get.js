import {genDB,genESP32,enBtns,disBtns,cleanDown,autoClean} from "./page.js";
import {dataAvailable} from "./main.js";
import {updateValues} from "./update.js";

import {API} from "./api.js";
        export async function getInfo() {
            try{
                const response = await fetch(`${API}/data`);
                const data = await response.json();  
                const dbta=data.dbta;
                console.log(data.esp);
                if(!dbta.connected){
                    console.log("database not connected!")
                    genDB("down");
                }else{
                    genDB("up",dbta.type);
                }

                const esp=data.esp;
                if(!esp.connected){
                    console.log("esp not connected!")
                    genESP32("down");
                }else{
                    genESP32("up");
                }
                    if(esp.connected){
                        if(esp.status=="nowCleaning"||cleanDown){
                            disBtns();
                        }else if(esp.status=="idle"||esp.status=="doneCleaning"){
                            enBtns();
                        }else{
                            disBtns();
                            console.log(`Invalid state...?\n${esp.satus}`)
                        }    
                        updateValues(esp);
                    }
            }catch (err) {
                    console.log("critial error QwQ")
                    
                    genESP32("down");
                    genDB("down");
                    disBtns();
                console.error(err);
            }
        }

        export async function getLogs(){
            document.getElementById("logs").innerHTML="";
            const response = await fetch(`${API}/logs`);
            const data = await response.json().then(data => data=data[0]);
            data.forEach(data=>{
            let time=new Date(data.createdAt);
            time = time.toLocaleString('en-US', {
                month: 'short',
                day: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            });
            document.getElementById("logs").innerHTML+=`
                <div class="log-item">
                    <div class="log-date">${time}</div>
                    <strong>${data.eventType}</strong>
                    <p>${data.description}</p>
                    <div class="badge">${data.severity}</div>
                </div>
            `      
            })
        }
