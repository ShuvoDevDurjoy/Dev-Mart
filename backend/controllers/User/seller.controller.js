import bcrypt from "bcrypt";
import db from "../../database/models/index.mjs";
import {
  generateAuthToken,
  generateToken,
  verify_token,
} from "../../utils/auth.utils.js";
import { sendMail } from "../../mail/mailing.js";
import {
  seller_reset_password_mail_template,
  seller_verify_mail_template,
} from "../../mail/templates/seller_mail_template.js";
import { checkPassword } from "../../utils/bcrypt.utils.js";

/***********************************************************************************************************************
 * *********************************************************************************************************************
 * **************************** Contoller Methods for seller sign up and email verification 👍 *************************
 * *********************************************************************************************************************
 * *********************************************************************************************************************
 */

//checks if the seller is already in database or not 👍
const checkIfSellerInDB = async (req, res, next) => {
  try {
    //check if the user is in the database or not
    const dup_seller = await db.Seller.findOne({
      where: { seller_email: req.body.email },
    });

    //if the user is already in the database or is verified
    //then return that the user is already in database
    //else procced
    if (dup_seller && dup_seller.is_verified) {
      return res.status(409).json({
        success: false,
        message: "Duplicate Seller! Account Already Exist, Please Login.",
      });
    }

    if (dup_seller) {
      req.body.dup_seller = true;
    } else {
      req.body.dup_seller = false;
    }

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
  2) generate token named seller_email, which will be used to verify email
  3) sends verification mail to the seller with the generated token
  4) if the seller is a duplicate seller(verified in the previous controller method), then update the seller data like
    email_verification_token and password
*/
const validateSeller = async (req, res, next) => {
  try {
    //hash the password using bcrypt
    const hashed_password = await bcrypt.hash(req.body.password, 10);

    //generate token for session
    const token = await generateAuthToken(
      req,
      res,
      {
        seller_email: req.body.email,
      },
      process.env.JWT_SELLER_SECRET,
      "seller_identity_token",
      24
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
      return seller_verify_mail_template(token);
    });

    //check if mail send is successfull
    if (!sendMail) {
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }

    if (req.body.dup_seller) {
      await db.Seller.update(
        {
          email_verification_token: token,
          seller_password: hashed_password,
        },
        {
          where: {
            email: req.body.email,
          },
        }
      );
    } else {
      await db.Seller.create({
        seller_name: req.body.name,
        seller_email: req.body.email,
        business_name: req.body.business_name,
        seller_password: hashed_password,
        email_verification_token: token,
      });
    }

    return res.status(201).json({
      success: true,
      message: "Please Check Mail To Verify it's You",
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Failure",
    });
  }
};



/***********************************************************************************************************************
 * *********************************************************************************************************************
 * ******************************* Controller Methods for seller Authentication 👍 *************************************
 * *********************************************************************************************************************
 * *********************************************************************************************************************
*/

//check if the seller verification token is valid and update the seller if he/she is verified or not 👍
const dbSellerVeficationUpdate = async (req, res) => {
  try {
    //decode the user email verification token
    const decoded = await verify_token(
      req.params.token,
      process.env.JWT_SELLER_SECRET
    );

    //check if the token is valid
    if (!decoded.success) {
      return res.status(400).json({
        success: false,
        message: "Token is no loonger valid.",
      });
    }

    //get the seller_email from the token
    const email = decoded.seller_email;

    const seller = await db.Seller.findOne({
      where: {
        seller_email: email,
      },
    });

    //check if the seller is there if not this is a false request
    //and if the seller is already verified then the token is no loonger valid
    if (
      !seller ||
      seller.is_verified ||
      seller.email_verification_token === null
    ) {
      return res.status(400).json({
        success: false,
        message: "Token is no loonger valid.",
      });
    }

    seller.is_verified = true;
    seller.email_verification_token = null;
    seller.save();

    return res.status(200).json({
      success: true,
      message: "Email Verification Successfull",
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


//check seller authorization token and login the user if all the details are given right 👍
const StartUpAuth = async (req, res) => {
  try {
    const seller_email = req.body.seller_email;

    const seller = await db.Seller.findOne({
      attributes: ['seller_id', 'seller_name', 'is_verified'],
      where: { seller_email: seller_email },
    });

    if (!seller || !seller.is_verified) {
      return res.staus(400).json({
        success: false,
      });
    }

    const token = await generateAuthToken(req, res, 
    {
      "seller_email": seller_email
    },
    process.env.JWT_SELLER_SECRET,
    "seller_identity_token",
    24
  )

  if(!token){
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    })
  }
    
    return res.status(200).json({
      success: true,
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: "Server Failure",
      e_message: e.message
    });
  }
};


/***********************************************************************************************************************
 * *********************************************************************************************************************
 * ******************************* Controller Methods for seller Login 👍 **********************************************
 * *********************************************************************************************************************
 * *********************************************************************************************************************
 */

/*
  This method does the following things 👍
  1) check a seller in the database
  2) if the seller is not in the database then this will return a response that the seller is non exist
  3) then compare the given password and encrypted password
*/
const validateSellerLoginData = async (req, res, next) => {
  try {
    const seller = await db.Seller.findOne({
      attributes: [
        "seller_name",
        "seller_id",
        "seller_password",
        "is_verified",
      ],
      where: {
        seller_email: req.body.email,
      },
    });

    if (!seller || !seller.is_verified) {
      return res.status(400).json({
        success: false,
        message: "Invalid Request",
      });
    }

    //check if password is valid or not using bcrypt
    const checkPasswordResult = await checkPassword(
      req.body.password,
      seller.seller_password
    );

    if (!checkPasswordResult.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid Email or Password.",
      });
    }

    const token = await generateAuthToken(
      req,
      res,
      {
        seller_email: req.body.email,
        seller_id: seller.seller_id,
      },
      process.env.JWT_SELLER_SECRET,
      "seller_identity_token",
      24
    );

    if (!token) {
      return res.status(500).json({
        success: false,
        message: "Server Failure",
      });
    }

    return res.status(200).json({
      success: true,
      seller_name: seller.seller_name,
      seller_id: seller.seller_id,
      message: "Login Successfull",
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: "Invalid Request",
    });
  }
};

/***********************************************************************************************************************
 * *********************************************************************************************************************
 * ******************************* Controller Methods for seller password reset 👍 *************************************
 * *********************************************************************************************************************
 * *********************************************************************************************************************
 */

//reset the seller password reset token to database and sends mail to the seller with 👍
//the token to verify mail
const setSellerPasswordResetToken = async (req, res) => {
  try {
    //check if the user with the given email is in database
    const seller = await db.Seller.findOne({
      where: { seller_email: req.body.email },
    });

    //if not send a failure message
    if (!seller || !seller.is_verified) {
      return res.status(401).json({
        success: false,
        message:
          "You Do not have any Account or Not verified yet. Please Sign Up!!!",
      });
    }

    //if the seller is in the database
    const token = await generateToken(
      {
        seller_email: req.body.email,
      },
      process.env.JWT_SELELR_PASSWORD_RESET_SECRET,
      1
    );

    if (!token) {
      return res.status(500).json({
        success: false,
        message: "Internal Server error",
      });
    }

    const send_mail = await sendMail(
      req.body.email,
      "User Password Reset",
      () => {
        return seller_reset_password_mail_template(token);
      }
    );

    if (!send_mail) {
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }

    //reset password token for mail verification
    seller.reset_password_token = token;
    await seller.save();

    return res.status(200).json({
      success: true,
      message: "Please Check Mail To Reset Password",
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

//check the password reset token 👍
//if the token is valid then sends the password reset page(the page can only be used once) or
//return a token is not valid message
const ResetSellerPasswordTokenVerify = async (req, res, next) => {
  try {
    //decodes the token
    const decoded = await verify_token(
      req.query.token,
      process.env.JWT_SELELR_PASSWORD_RESET_SECRET
    );

    //check if decoding is successfull
    if (!decoded.success || !decoded.seller_email) {
      return res.json({
        success: false,
        message: "The token is no loonger valid",
      });
    }

    //check if the seller in the database
    const seller = await db.Seller.findOne({
      where: { seller_email: decoded.seller_email },
    });

    if (!seller.is_verified) {
      return res.json({
        success: false,
        message:
          "You do not have any account or Not verified. Sign up, Please!!!",
      });
    }

    if (seller.reset_password_token === null) {
      return res.status(400).json({
        success: false,
        message: "Invalid Request",
      });
    }

    await seller.save();

    next();
  } catch (e) {
    console.log(e);
    return res.json({
      success: false,
      message: "Invalid Token",
    });
  }
};

//checks all the necessary thing like token decode, mail, password and if all are good 👍
//then reset the user password
const resetSellerPassword = async (req, res, next) => {
  try {
    const decoded = await verify_token(
      req.body.token,
      process.env.JWT_SELELR_PASSWORD_RESET_SECRET
    );

    if (!decoded.success || decoded.seller_email !== req.body.email) {
      return res.status(400).json({
        success: false,
        message: "Invalid Token or email",
      });
    }

    //https://login.alibaba.com/reg/union_reg.htm?spm=a2700.product_home_newuser.sign_up.sign_up_button&_regfrom=ICBU_UNION_REG&_regbizsource=main_page&_lang=en_US&tg=https%3A%2F%2Fug.alibaba.com%2Fapi%2Fpc%2Fregister%2Fredirect%3Fscene%3Dpc_header

    const seller = await db.Seller.findOne({
      where: { seller_email: req.body.email },
    });

    if (req.body.token !== seller.reset_password_token) {
      return res.status(400).json({
        success: false,
        message: "Token is not valid",
      });
    }

    seller.reset_password_token = null;
    const hashed_password = await bcrypt.hash(req.body.password, 10);
    seller.seller_password = hashed_password;
    await seller.save();
    next();
  } catch (e) {
    console.log(e.message);
    return res.json({
      success: false,
      message: "Invalid request",
    });
  }
};



//handles signing out a seller 👍
const sellerSignOutHandlder = async (req, res) => {
  try {
    res.clearCookie("seller_identity_token", { path: "/" });

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


const dbSellerVerification = async (req, res, next) => {
  try {
    const seller_email = req.body.seller_email;
    const seller = await db.Seller.findOne({
      where: {
        seller_email: seller_email,
      },
    });
    if (!seller || !seller.is_verified) {
      return res.status(400).json({
        success: false,
        message: "Login to Continue",
      });
    }

    next();
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: "Server Failure",
    });
  }
};

export {
  checkIfSellerInDB,
  validateSeller,
  validateSellerLoginData,
  dbSellerVeficationUpdate,
  dbSellerVerification,
  StartUpAuth,
  setSellerPasswordResetToken,
  ResetSellerPasswordTokenVerify,
  sellerSignOutHandlder,
  resetSellerPassword,
};
