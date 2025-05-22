import { createPool } from "mysql2/promise";


const connections = createPool({
    host : 'localhost',
    port : 3306,
    user : 'root',
    password : '1234',
    database : 'e_commerce'
})

export {connections} ; 