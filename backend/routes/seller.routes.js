import { Router } from "express";
import path from "path";
import { __dir } from "../config/__dir.config.js";
import {
  checkSeller,
  checkSellerAuthToken,
  checkSellerLoginCredentials,
  checkSellerSignOutCredentials,
  checkSellerSignUpCredentials,
} from "../middleware/authSeller.middleware.js";
import {
  ResetSellerPasswordTokenVerify,
  StartUpAuth,
  checkIfSellerInDB,
  dbSellerVeficationUpdate,
  resetSellerPassword,
  sellerSignOutHandlder,
  setSellerPasswordResetToken,
  validateSeller,
  validateSellerLoginData,
} from "../controllers/User/seller.controller.js";
import { checkAuthEmailToken, checkEmail, checkResetMailToken, checkResetPasswordCredentials } from "../middleware/auth.middleware.js";

const seller = Router();

/***********************************************************************************************************************
 * *********************************************************************************************************************
 * ******************************* Seller Routes for sign up and email verification 👍 *********************************
 * *********************************************************************************************************************
 * *********************************************************************************************************************
*/

//allows seller to sign in a account  👍
seller.post("/sign_up", checkSellerSignUpCredentials, checkIfSellerInDB, validateSeller);

//checks email token to verify a seller while signing up  👍
seller.get( "/auth/verify_mail/:token", checkAuthEmailToken, dbSellerVeficationUpdate );

//start up authorization using authorization token 👍
seller.get("/auth/startup", checkSellerAuthToken, StartUpAuth);


/***********************************************************************************************************************
 * *********************************************************************************************************************
 * *************************************** Seller Routes for Login 👍 **************************************************
 * *********************************************************************************************************************
 * *********************************************************************************************************************
*/

seller.post("/login", checkSellerLoginCredentials, validateSellerLoginData);



/***********************************************************************************************************************
 * *********************************************************************************************************************
 * *********************************** User Routes for seller password reset 👍 ****************************************
 * *********************************************************************************************************************
 * *********************************************************************************************************************
*/


//take request for resetting password and sends mail to the given mail 👍
seller.post("/reset/password", checkEmail, setSellerPasswordResetToken);

//check if the token is valid for password reset(got from mail)  and  👍
seller.get("/auth/reset/password",
  checkResetMailToken,
  ResetSellerPasswordTokenVerify,
  (req, res) => {
    return res.sendFile(
      path.join(__dir, "../", "frontend", "dist", "SellerResetPassword.html")
    );
  }
);

//reselt seller password 👍
seller.post(
  "/reset_password/m/verified",
  (req, res, next) => {
    console.log(req.body)
    next();
  },
  checkResetPasswordCredentials,
  resetSellerPassword,
  (req, res) => {
    return res.status(200).json({
      success: true,
      message: "Password is changed successfully",
    });
  }
);


seller.get('/sign_out',checkSellerSignOutCredentials, sellerSignOutHandlder);


export default seller;
