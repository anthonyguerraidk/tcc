import {getInfo, getLogs} from "./get.js";
import { toggle } from './page.js';
import {startCleaning} from './functions.js';
document.getElementById('autoMode')
    .addEventListener('change', toggle);

document.getElementById('clen')
    .addEventListener('click', startCleaning);

        setInterval(getInfo,4000);    
        export let dataAvailable=false;

getInfo();
getLogs();
    