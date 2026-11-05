import {dataAvailable} from "./main.js";
import {cleanDown} from './page.js';

export async function startCleaning() {
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

