import { Router } from "express";

const orders = Router();

orders.get('/items',(req,res)=>{
    res.send({
        name : 'shuvo dev'
    })
}) ; 


orders.post('/items',);

export default orders ; 