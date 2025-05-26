import db from "../../database/models/index.mjs"

const checkProductIdDB = async(req, res, next)=>{
    try{
        const product = await db.Product.findOne({
            where: {
                
            }
        })
    }catch(e){
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}