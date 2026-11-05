import 'dotenv/config';
import mysql from 'mysql2/promise';

export let db;
export async function startDB(){
    try{
		db = await mysql.createConnection({
		    host: process.env.DB_HOST,
		    user: process.env.DB_USER,
		    password: process.env.DB_PASS,
		    database: process.env.DB_NAME,
		    port: process.env.DB_PORT
		});
    }catch(err){
      console.log("connection to databse failed")
      console.log(err);
      return;
    }

}
