import {Router} from 'express';
import { github_upload } from '../config/multer.config.js';
import {  githubUpload } from '../middleware/product.middleware.js';
import { checkCategoryName } from '../middleware/product.middleware.js';
import { saveCategoryNameDB } from '../controllers/User/product.controller.js';
import { getCurrencyWithId, setCurrencyDB } from '../controllers/Admin/units.controller.js';
import { checkCurrency } from '../middleware/utils.middleware.js';

const admin = Router();

admin.get('/',async(req,res)=>{
    return res.send({
        message : "This is from the admin panel"
    })
})


admin.post('/set_currency',checkCurrency, setCurrencyDB);

admin.get("/get_currencies_with_id", getCurrencyWithId);

admin.post('/api/v1/set_category',
    github_upload.single("category_image"),
    checkCategoryName,
    githubUpload,
    saveCategoryNameDB,
    async(req, res)=>{
    try{
        return res.send({
            success: true,
            message: "Category Upload Successfull"
        })
    }catch(e){
        console.log("Error with decoding image");
        return res.send({
            success: false,
            message: "Server Failed"
        })
    }
})

export default admin ; 