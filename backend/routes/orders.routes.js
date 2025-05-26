import { Router } from "express";
import { checkUserIdDB } from "../controllers/User/user.controller.js";
import { checkOrder, orderDbUpload, uploadToOrdersDB } from "../controllers/User/order.controller.js";

const orders = Router();

orders.get('/items',(req,res)=>{
    res.send({
        name : 'shuvo dev'
    })
}) ; 


orders.post("/place_order",(req, res, next)=>{console.log(req.body); next();}, checkUserIdDB, checkOrder, uploadToOrdersDB, orderDbUpload)


orders.post('/items',);

export default orders ; 