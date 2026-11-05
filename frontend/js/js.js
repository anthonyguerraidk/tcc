        setInterval(getInfo,4000);
        const API = "http://localhost:3000"
        
        //const API = "http://192.168.50.1:3000"; //configured according to lan script
        //this variable tracks whether one of the funcition buttons has been pressed
        //so there is immediate feedback to the user, 
        //bc theres a delay before the esp answers

        let cleanDown=false;
        let dbUp=false;
        let espUp=false;
        let dataAvailable=false;
        let autoClean=false;
        let panic=false;

        async function getInfo() {
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
                    panic=true;
                    disBtns();
                console.error(err);
            }
        }

        async function getLogs(){
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

        let pages=["dashboard","logs"]
        function changePage(page){
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


//      i could merge these two functions btw
        function genDB(a,b){ 


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

        function genESP32(a){
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


        function toggle(){
            autoClean=!autoClean;
            updateSettings();
            getInfo();
        }

        //if you put a getInfo() in this function you create a bomb
        async function updateSettings(){
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
        function updateValues(esp){
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

        function disBtns(){
            cleanDown=false;//for some reason it works here... well, whatever
            document.querySelectorAll("#actions button").forEach(btn => {
                btn.setAttribute("disabled","");
                btn.setAttribute("class","dis");
            });
        }

        function enBtns(){
            cleanDown=false;
            document.querySelectorAll("#actions button").forEach(btn => {
                btn.removeAttribute("disabled","");
                document.getElementById("clen").setAttribute("class","btn-primary");
                document.getElementById("stop").setAttribute("class","btn-danger");
            });
        }

        
        async function startCleaning() {
            cleanDown=true;
            try {
                const response = await fetch(`${API}/clean/start`, {
                    method: "POST"
                });
                const data = await response.json();
                console.log(data.command);
                getInfo();
            } catch (err) {
                console.error(err);
            }
        }
        
        //work on this, not working
        async function stopCleaning() {
            try {
                await fetch(`${API}/clean/stop`, {
                    method: "POST"
                });
        
                getInfo();
            } catch (err) {
                console.error(err);
            }
        }
