

//check if email address is given in req.body 👍
const checkEmail = async(req,res,next)=>{
    try{
        if(!req.body.email){
            return res.json({
                success : false,
                message : "Please, provide you email address"
            })
        }
        next();
    }catch(e){
        return res.json({
            success : false,
            message : "Please Provide a correct email Address"
        })
    }
}


// Checking if mail token to verifiy mail is given with the request 👍
const checkAuthEmailToken = async(req,res,next)=>{
    try{
        if(!req.params.token){
            return res.status(401).json({
                success : false,
                message : 'Token not found'
            })
        }
        next();        
    }catch(e){
        return res.status(500).json({
            success : false,
            message : 'Internal Server Error'
        })
    }
}


//check if the user password reset token is given or not 👍
const checkResetMailToken = async(req,res,next)=>{
    if(!req.query.token){
        return res.json({
            success : false
        })
    }
    next();
}


//checks if the user reset password email and password are given to reset the password 👍
const checkResetPasswordCredentials = async(req,res,next)=>{
    if(!req.body.email || !req.body.password){
        return res.status(200).json({
            success : false,
            message : "Please Fill out all the field"
        })
    }
    next();
}




const checkSeller = async(req, res, next)=>{
    try{
        
    }catch(e){
        return res.status(400).json({
            success: false,
            message: "Invalid Request"
        })
    }
}


export {
    checkEmail,
    checkResetMailToken,
    checkAuthEmailToken,
    checkResetPasswordCredentials
}