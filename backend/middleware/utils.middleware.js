const checkCurrency = async(req, res, next)=>{
    try{
        if(!req.body.currency_code || !req.body.exchange_rate){
            return res.status(400).json({
                success: false,
                message: "Please Fill Out All the Field"
            })
        }

        if(!(/^[0-9].*[0-9]$/.test(req.body.exchange_rate) || !(/^[A-Z]{3}$/.test(req.body.currency_code))))
        {
            return res.status(400).json({
                success: false,
                message: "Invalid Currency Code or Exchange Rate Format"
            })
        }

        next();

    }catch(e){
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}


export {
    checkCurrency
}