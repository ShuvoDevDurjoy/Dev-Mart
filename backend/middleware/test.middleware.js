const checkProductId = async(req, res, next)=>{
    try{
        if(!req.body.product_id){
            return res.status(400).json({
                success: false,
                message: "Please Provide Product Id"
            })
        }

        next();
    }catch(e){
        return res.status(400).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}


export {
    checkProductId
}