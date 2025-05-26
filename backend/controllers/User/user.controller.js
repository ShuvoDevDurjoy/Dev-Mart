import bcrypt from "bcrypt";

import db from "../../database/models/index.mjs";
import {
  generateAuthToken,
  generateToken,
  verify_token,
} from "../../utils/auth.utils.js";
import { sendMail } from "../../mail/mailing.js";
import {
  user_reset_password_mail_template,
  user_verify_mail_template,
} from "../../mail/templates/user_mail_templates.js";


/***********************************************************************************************************************
 * *********************************************************************************************************************
 * **************************** Contoller Methods for user sign up and email verification 👍 ***************************
 * *********************************************************************************************************************
 * *********************************************************************************************************************
*/

//checks if the user is already in database or not 👍
const checkIfUserInDB = async (req, res, next) => {
  try {
    //check if the user is already in the database
    const dup_user = await db.Users.findOne({
      where: { email: req.body.email },
    });
    //if the user is in database and is verifed then return that it is a duplicate user
    if (dup_user && dup_user.is_verified) {
      return res.status(409).json({
        success: false,
        message: "Duplicate User! Account Already Exist, Please Login.",
      });
    }

    if(dup_user){
      req.body.dup_user = true;
    }
    else{
      req.body.dup_user = false;
    }

    //else procced to next step
    next();
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

/*
  This function does these things 👍
  1) hash the password
  2) generate token named user_email, which will be used to verify email
  3) sends verification mail to the user with the generated token
  4) if the user is a duplicate user(verified in the previous controller method), then update the user data like
    verification_token and password
*/
const saveUserIntoDb = async (req, res, next) => {
  try {
    //hash the password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    
    //set token for auto authentication
    const token = await generateAuthToken(
      req,
      res,
      {
        user_email: req.body.email,
      },
      process.env.JWT_USER_SECRET,
      "user_auth_token",
      1
    );

    //check if the token is generated successfully
    if (!token) {
      return res.status(500).send({
        success: false,
        message: "Internal server failure",
      });
    }


    //sends email verification mail to the user
    await sendMail(req.body.email, "User Verification Mail", () => {
      return user_verify_mail_template(token);
    });

    //check if mail send is successfull
    if(!sendMail){
      return res.status(500).json({
        success: false,
        message: "Internal Server Error"
      })
    }

    if (req.body.dup_user) {
      await db.Users.update({
        verification_token: token,
        password: hashedPassword,
      },
      {
        where: {
          email: req.body.email
        }
      }
    )
    }
    else {
      const user = await db.Users.create({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        verification_token: token,
      });
    }
    //if everything is fine then the user will be notified that he is signed up
    return res.status(201).json({
      success: true,
      message: "Please Check Mail to Verify It's You !!!",
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Failure, Try Again."
    });
  }
};




/***********************************************************************************************************************
 * *********************************************************************************************************************
 * ******************************** Controller Methods for user Authentication 👍 ***************************************
 * *********************************************************************************************************************
 * *********************************************************************************************************************
*/


//check if the user verification token is valid and update the user if he/she is verified or not 👍
const dbUsersVeficationUpdate = async (req, res, next) => {
  try {
    //decode the user email verification token
    const decoded = await verify_token(
      req.params.token,
      process.env.JWT_USER_SECRET
    );
    //check if the token is valid
    if (!decoded.success) {
      return res.status(400).json({
        success: false,
        message: "Token is no loonger valid.",
      });
    }
    //get the user_email from the token 
    const email = decoded.user_email;

    const user = await db.Users.findOne({
      where: { email },
    });

    if (!user || user.is_verified) {
      return res.status(400).json({
        success: false,
        message: "Token is no loonger valid.",
      });
    }

    user.is_verified = true;
    user.verification_token = null;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Your Verification is Successfull."
    });
  } catch (e) {
    console.log(e);
    return res.status(400).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};

//check token , decode it, check in database, if the user in database and is verified then reset token and 👍
//let the user login 
const validateUserAuthentication = async(req, res)=>{
  try{
      const decoded = await verify_token(req.cookies['user_auth_token'], process.env.JWT_USER_SECRET);

      if(!decoded || !decoded.user_email){
        return res.status(400).json({
          success: false,
          message: "Invalid Request"
        })
      }

      const user = await db.Users.findOne({
        attirbutes: [
          'id', 
          'name',
          'is_verified'
        ]
        ,where: {
        email: decoded.user_email
      }})

      if(!user || !user.is_verified){
        return res.status(400).json({
          success: false,
          message: "User does not exist or not verified"
        })
      }

      const token = await generateAuthToken(req, res, 
        {
          user_email: decoded.user_email
        }, 
        process.env.JWT_USER_SECRET,
        "user_auth_token",
        24);

      return res.status(200).json({
        success: true,
        message: "Authentication Successfull"
      })
  }catch(e){
    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    })
  }
}





/***********************************************************************************************************************
 * *********************************************************************************************************************
 * ******************************* Controller Methods for user Login 👍 ************************************************
 * *********************************************************************************************************************
 * *********************************************************************************************************************
*/


/*
  This method does the following things 👍
  1) check a user in the database
  2) if the user is not in the database then this will return a response that the user is non exist
  3) then compare the given password and encrypted password
*/
const userLoginValidate = async (req, res) => {
  try {

    //check if the user is in the database
    const user = await db.Users.findOne({ 
      attirbutes: ['id', 'name'],
      where: { email: req.body.email } });
    if (!user || !user.is_verified) {
      return res.status(404).json({
        success: false,
        message: "You do not have any account or not authenticated, Please Sign Up!!!",
      });
    } 

    //compare the given password and encrypted password
    const matches = await bcrypt.compare(req.body.password, user.password);

    if(!matches){
      return res.status(400).json({
        success: false,
        message: "Password or Email Does not match."
      })
    }

    //if matches then generate token and log in the user by setting cookie for auto authentication
    const token = await generateAuthToken(
      req,
      res,
      {
        'user_email': req.body.email
      },
      process.env.JWT_USER_SECRET,
      "user_auth_token",
      24
    );
    
    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Login Failed",
      });
    }
    
    return res.status(200).json({
      success: true,
      message: "Login Successfull",
      id: user.id,
      user_name: user.name,
    });
  } catch (e) {
    console.log(e);
    return res.json({
      success: false,
      message: "Try Again",
    });
  }
};





/***********************************************************************************************************************
 * *********************************************************************************************************************
 * ******************************* Controller Methods for user password reset 👍 ***************************************
 * *********************************************************************************************************************
 * *********************************************************************************************************************
*/

//check user email and sets user password user_password_reset_token and sends email 👍
const setUserPasswordResetToken = async (req, res) => {
  try {
    //check if the user with the given email is in database
    const user = await db.Users.findOne({ where: { email: req.body.email } });

    //if not send a failure message
    if (!user || !user.is_verified) {
      return res.status(404).json({
        success: false,
        message: "You Do not have any Account, Please Sign Up!!!",
      });
    }

    //if the user is in the database
    const token = await generateToken(
      {
        user_email: req.body.email
      },
      process.env.JWT_USER_PASSWORD_RESET_SECRET,
      1
    );

    //check if the token is generated successfully or not
    if (!token) {
      return res.json({
        success: false,
        message: "Please Try Again",
      });
    }

    //sends mail to the user to reset password
    await sendMail(req.body.email, "User Password Reset", () => {
      return user_reset_password_mail_template(token);
    });

    //set reset password token
    user.reset_password_token = token;

    //save the user
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Please Check Mail To Reset Password",
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error."
    })
  }
};


//checks if the user password verification method is valid or not 👍
const ResetUserPasswordTokenVerify = async (req, res, next) => {
  try {

    //deconde the reset password verification token
    const decoded = await verify_token(
      req.query.token,
      process.env.JWT_USER_PASSWORD_RESET_SECRET
    );

    //check the decoded token is valid or not
    if ( !decoded.success || !decoded.user_email) {
      return res.status(400).json({
        success: false,
        message: "The token is no loonger valid",
      });
    }

    //check if the user with the given email is in the database or not
    const user = await db.Users.findOne({ where: { email: decoded.user_email } });

    //check if the user verification tokenis
    if (!user.reset_password_token) {
      return res.status(400).json({
        success: false,
        message: "The Token is no loonger valid",
      });
    }

    next();
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};



//reset user password in database 👍
const resetUserPassword = async (req, res, next) => {
  try {
    //user email is decoded
    const decoded = await verify_token(
      req.body.token,
      process.env.JWT_USER_PASSWORD_RESET_SECRET
    );

    //if decoded or email and decoded mail are equal
    if (!decoded.success || decoded.user_email !== req.body.email) {
      return res.status(400).json({
        success: false,
        message: "Invalid Token or email",
      });
    }

    
    const user = await db.Users.findOne({ where: { email: req.body.email } });

    if(!user || user.reset_password_token===null){
      return res.status(400).json(
        {
          success: false,
          message: "Invalid Token"
        }
      )
    }
    
    user.reset_password_token = null;

    //hash the password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    user.password = hashedPassword;
    await user.save();
    next();
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};




/***********************************************************************************************************************
 * *********************************************************************************************************************
 * ******************************* Controller Methods for user Sign Out 👍 *********************************************
 * *********************************************************************************************************************
 * *********************************************************************************************************************
*/


//handles signing out a user 👍
const userSignOutHandlder = async (req, res) => {
  try {
    res.clearCookie("user_auth_token", { path: "/" });

    return res.status(200).json({
      success: true,
      message: "Signing out successfull",
    });
  } catch (e) {
    console.log(e.message);
    return res.json({
      success: false,
      message: "Signing out failed",
    });
  }
};





const checkUserIdDB = async(req, res, next)=>{
  try{
    //checks if user id is provided or not
    if(!req.body.user_id){
      return res.status(400).json({
        success: false,
        message: "User Id Not Found"
      })
    }

    //check if the user id is in the database and if user is verified
    const user = await db.Users.findOne({
      where: {
        id: req.body.user_id
      }
    });

    if(!user || !user.is_verified){
      return res.status(400).json({
        success: false,
        message: "User Have no account or Not verified yet. Please Sign Up or Login!!!"
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
  checkIfUserInDB,
  saveUserIntoDb,
  userLoginValidate,
  dbUsersVeficationUpdate,
  setUserPasswordResetToken,
  ResetUserPasswordTokenVerify,
  resetUserPassword,
  validateUserAuthentication,
  userSignOutHandlder,

  checkUserIdDB
};
