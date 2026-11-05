import {dataAvailable} from "./main.js";

		export let cleanDown=false;
		let dbUp=false;
        let espUp=false;
        export let autoClean=false;
        let pages=["dashboard","logs"]
        export function changePage(page){
            let ok=false;
            for(let i=0;i<pages.length;i++){
                document.getElementById(pages[i]).setAttribute("hidden","");
                if(page==pages[i]){ok=true;}
            }
            if(!ok){
                document.getElementById("dashboard").removeAttribute("hidden",);
                console.log("page doesnt exist");
                return;
            }
            document.getElementById(page).removeAttribute("hidden");
        }

        export function toggle(){
            autoClean=!autoClean;
            updateSettings();
            getInfo();
        }

//      i could merge these two functions btw
        export function genDB(a,b){ 


            switch (a) {
                case "up":
                    document.getElementById("dotdb").style.color="green";
                    document.getElementById("dbStatus").style.color="green";
                    document.getElementById("dbStatus").innerText="UP";   
                    document.getElementById("dbtype").innerText=`Database (${b})`;
                    dbUp=true;
                break;
                case "down":
                default:
                    document.getElementById("dotdb").style.color="red";
                    document.getElementById("dbStatus").style.color="red";
                    document.getElementById("dbStatus").innerText="DOWN";
                    dbUp=false;
                break;
            }
        }

        export function genESP32(a){
//          switch version:

            switch (a) {
                case "up":
                    document.getElementById("dotesp").style.color="green";
                    document.getElementById("espStatus").style.color="green";
                    document.getElementById("espStatus").innerText="UP";
                    espUp=true;
                    enBtns(); 
                break;
                case "down":
                default:
                    document.getElementById("dotesp").style.color="red";
                    document.getElementById("espStatus").style.color="red";
                    document.getElementById("espStatus").innerText="DOWN";
                    espUp=false;
                    disBtns();
                break;
            }
        }


        export function disBtns(){
            cleanDown=false;//for some reason it works here... well, whatever
            document.querySelectorAll("#actions button").forEach(btn => {
                btn.setAttribute("disabled","");
                btn.setAttribute("class","dis");
            });
        }

        export function enBtns(){
            cleanDown=false;
            document.querySelectorAll("#actions button").forEach(btn => {
                btn.removeAttribute("disabled","");
                document.getElementById("clen").setAttribute("class","btn-primary");
                document.getElementById("stop").setAttribute("class","btn-danger");
            });
        }