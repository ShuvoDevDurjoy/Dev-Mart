import multer from "multer";

const memoryStorage = multer.memoryStorage();

const github_upload = multer({storage : memoryStorage});


const ProductImageSavingDistStorage = multer.diskStorage({
    destination : (req,file,cb)=>{
        cb(null,process.env.PRODUCT_IMAGE_SAVING_DIRECTORY);
    },
    filename : (req,file,cb)=>{
        cb(null,req.body.filename);
    }
})

const ProductImageSaving = multer({
    storage : ProductImageSavingDistStorage
})


export {
    github_upload,
    ProductImageSaving
}