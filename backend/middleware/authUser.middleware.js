import db from "../database/models/index.mjs";


/* Checks the credentials needed for sign up of User 👍 */
const checkSignUpCredential = async(req,res,next)=>{
    try{
        //check if NAME, EMAIL and PASSWORD is given with Credentials
        //if not then return with exit code 400 and message that Fill out all the fields
        if(!(req.body.name && req.body.email && req.body.password)){
            return res.status(400).json({
                success : false,
                message : "Please fill out all the field"
            })
        }
        //if all the data is given then proceed to the next step
        next();
        
    }catch(e){
        //internal Server Error Occured
        return res.status(500).json({
            success : false,
            message : "Internal Server Failure"
        })
    }
}


//check if the user email and password is given with request for login 👍
const checkLoginCredential = async(req,res,next)=>{
    if(!(req.body.email && req.body.password)){
        return res.json({
            success : false,
            message : "Please fill out all the field"
        })
    }

    next();

}


//check auto auth token for user 👍
const checkUserAuthToken = async(req, res, next)=>{
    try{
        if(!req.cookies['user_auth_token']){
            return res.status(400).json({
                success: false,
                message: "Invalid Request"
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



//checks if the user verifying auth token is given or not 👍
const checkSignOutCredentials = async(req,res,next)=>{
    try{
        if(!req.cookies['user_auth_token']){
            return res.status(400).json({
                success : true,
                message : "Signing out successful"
            })
        }
        next();
    }catch(e){
        console.log(e);
        return res.json({
            success : true,
            message : "You are already signed out"
        })
    }
}



export {
    checkLoginCredential,
    checkSignUpCredential,
    checkUserAuthToken,
    checkSignOutCredentials,
}