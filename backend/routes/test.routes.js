import Router from "express";
import { github_upload } from "../config/multer.config.js";
import {
  githubUpload,
} from "../middleware/product.middleware.js";
import path from "path";
import axios from "axios";
import { v4 as uuid } from 'uuid'
import { checkCategory, saveCategoryDb } from "../controllers/User/product.controller.js";

const test = Router();









// test.get('/order',async(req,res,next)=>{
//   console.log("order received");
//   next();
// }, checkOrder, orderDbUpload);




test.get('/get_category_name_with_type', );





export { test };
