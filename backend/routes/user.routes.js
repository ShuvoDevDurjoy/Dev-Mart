import { Router } from "express";
import {
  checkLoginCredential,
  checkSignUpCredential,
  checkSignOutCredentials,
  checkUserAuthToken,
} from "../middleware/authUser.middleware.js";
import {
  ResetUserPasswordTokenVerify,
  checkIfUserInDB,
  dbUsersVeficationUpdate,
  resetUserPassword,
  saveUserIntoDb,
  setUserPasswordResetToken,
  userLoginValidate,
  userSignOutHandlder,
  validateUserAuthentication,
} from "../controllers/User/user.controller.js";
import {
  checkEmail,
  checkAuthEmailToken,
  checkResetMailToken,
  checkResetPasswordCredentials
} from "../middleware/auth.middleware.js";
import path from "path";
import { __dir } from "../config/__dir.config.js";
const user = Router();

/***********************************************************************************************************************
 * *********************************************************************************************************************
 * ********************************* User Routes for sign up and email verification 👍 *********************************
 * *********************************************************************************************************************
 * *********************************************************************************************************************
*/

//allows user to sign in a account  👍
user.post("/sign_up",
   checkSignUpCredential, //check done
   checkIfUserInDB,
   saveUserIntoDb
);

//checks email token to verify a user while signing up  👍
user.get(
  "/auth/verify_mail/:token",
  checkAuthEmailToken,
  dbUsersVeficationUpdate
);



user.get("/auth/auto_auth", checkUserAuthToken, validateUserAuthentication);


/***********************************************************************************************************************
 * *********************************************************************************************************************
 * ************************************ User Routes for user Login 👍 **************************************************
 * *********************************************************************************************************************
 * *********************************************************************************************************************
*/

//allows user to login into account 👍
user.post("/login", checkLoginCredential, userLoginValidate);



/***********************************************************************************************************************
 * *********************************************************************************************************************
 * *********************************** User Routes for user password reset 👍 ******************************************
 * *********************************************************************************************************************
 * *********************************************************************************************************************
*/



//lets a verified user to reset his/her password 👍
user.post("/reset/password", checkEmail, setUserPasswordResetToken);


//check the reset password verification mail token and sends the reset password html page 👍
user.get(
  "/auth/reset/password",
  checkResetMailToken,
  ResetUserPasswordTokenVerify,
  (req, res) => {
    return res.sendFile(
      path.join(__dir, "../", "frontend", "dist", "UserResetPassword.html")
    );
  }
);

//reset user password in the database 👍
user.post(
  "/reset_password/m/verified",
  checkResetPasswordCredentials,
  resetUserPassword,
  (req, res) => {
    return res.json({
      success: true,
      message: "Password is changed successfully",
    });
  }
);



/***********************************************************************************************************************
 * *********************************************************************************************************************
 * **************************************** Seller Routes for Sign Out 👍 **********************************************
 * *********************************************************************************************************************
 * *********************************************************************************************************************
*/
//lets seller to sign out of account 👍
user.post("/sign_out", checkSignOutCredentials, userSignOutHandlder);

export default user;
