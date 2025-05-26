import express from 'express' 
import dotenv from 'dotenv'
import http from 'http'
import cors from 'cors'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import orders from '../routes/orders.routes.js'
import product from '../routes/product.routes.js'
import { __dir } from '../config/__dir.config.js'
import checkSequelizeConnection from '../config/sequelize.js'
import user from '../routes/user.routes.js'
import admin from '../routes/admin.routes.js'
import seller from '../routes/seller.routes.js'
import path from 'path'
import {Server} from 'socket.io'
// import { test } from '../routes/test.routes.js'


dotenv.config();

const app = express() ; 

// app.use(ExpressFormidable());

const server = http.createServer(app);

const io = new Server(server, {
    cors:{
        origin: ['http://localhost:3000'],
        credentials: true
    }
})

//MiddleWares
app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json({}));
app.use(cookieParser());


console.log(`/${process.env.PRODUCT_IMAGE_SAVING_DIRECTORY}`);


app.use(cors({
    origin : [
        'http://localhost:3000'
    ],
    credentials : true
}))
app.set('io',io);

io.on('connection',(socket)=>{
    console.log("Socket connected", socket.id);

    socket.on('disconnect',()=>{
        console.log("socket disconnected", socket.id);
    })
})


app.use(`/${process.env.PRODUCT_IMAGE_SAVING_DIRECTORY}`,express.static('public/static'));

app.use('/u/auth/reset/',express.static(path.join(__dir,'../','frontend','dist')))
app.use('/s/auth/reset/',express.static(path.join(__dir,'../','frontend','dist')))


app.get('/',(req,res)=>{
    console.log('to file state');
    res.send({
        name : 'shuvo dev'
    });
})

app.use('/u',user)

app.use('/s',seller);

app.use('/admin',admin);

app.use('/product',product);

app.use('/orders',orders);

server.listen(process.env.PORT,()=>{
    try{
        checkSequelizeConnection();
        console.log(`Server is running on port ${process.env.PORT}..... `)
    }catch(e){
        console.log("Server running failed...",e);
    }
})
