import { verify_token } from "../utils/auth.utils.js";



//checks if name, email, business_name and password of the seller is given  👍
//for sign up
const checkSellerSignUpCredentials = async (req, res, next) => {
  try {
    //check if name, email, passowrd and business_name are given or not
    if (
      !req.body.name ||
      !req.body.email ||
      !req.body.business_name||
      !req.body.password
    ) {
      return res.status(209).json({
        success: false,
        message: "Please Fill out all the field",
      });
    }
    //if all are given then procced to next step
    next();
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};



//checks if the token for authorization that is send by the server is given or not 👍
const checkSellerAuthToken = async(req, res, next)=>{
  try{
    //extract the token from the request
    const token = req.cookies['seller_identity_token'];
    //check if the token is there or not
    if(!token){
      return res.status(400).json({
        success: false,
        message: "Token is not valid"
      })
    }
    //if the token is there then verify the token
    const result = await verify_token(token, process.env.JWT_SELLER_SECRET);

    if(!result.success || !result.seller_email){
      return res.status(400).json({
        success: false,
        message: "Token is no longer valid"
      })
    }

    req.body.seller_email = result.seller_email;
    
    next();
  }catch(e){
    return res.status(500).json({
      success: false,
      message: "Server Failure"
    })
  }
}


//check if all the details needed to login a seller are given or not 👍
const checkSellerLoginCredentials = async (req, res, next) => {
  try {

    //select name and email address from request body
    const { email, password } = req.body;
    
    //check if user name and email are given or not 
    if(!email || !password){
        return res.status(400).json({
            success: false,
            message: "Please Fill Out All The Fields"
        })
    }

    //if all the details are given then procced to next step
    next();

  } catch (e) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


//checks if the user verifying auth token is given or not 👍
const checkSellerSignOutCredentials = async(req,res,next)=>{
    try{
        if(!req.cookies['seller_identity_token']){
            return res.status(200).json({
                success : true,
                message : "Signing out successfull"
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


const checkSeller = async (req, res, next) => {
  try {
    //select the token from request
    const token = req.cookie.seller_identity_token;

    //check if token is there or not
    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Invalid Request",
      });
    }

    // if there is token then procced to next step verify the token
    const result = verify_token(token, process.env.SELLER_AUTH_SECRET_TOKEN);

    //check if token is not valid return
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Token is no Loonger Valid",
      });
    }

    //set up the seller_id to the request body
    req.body.seller_id = result.decoded.seller_id;
    req.body.seller_email = result.decoded.seller_email;

    next();

  } catch (e) {
    return res.status(400).json({
      success: false,
      message: "Invalid Request",
    });
  }
};



export {
  checkSellerSignUpCredentials,
  checkSellerLoginCredentials,
  checkSellerAuthToken,
  checkSellerSignOutCredentials,
  checkSeller,
};
