import jwt from "jsonwebtoken";

const generateToken = async ( object, secret, duration=1) => {
  try {
    const token = jwt.sign(
      object,
      secret,
      {
        expiresIn: `${duration}h`,
      }
    );
    return token;
  } catch (e) {
    console.log("error with generation token", e);

    return false;
  }
};


//generate token and set Cookie for the given time and object 👍
const generateAuthToken = async(req, res, obj, secret, cookie_name = "", duration=1) => {
  try {
    //generate token based on the given parameters
    const token = jwt.sign(
      obj,
      secret,
      {
        expiresIn: `${duration}h`,
      }
    );
    
      res.cookie(cookie_name, token, {
        httpOnly: true,
        secure: false,
        maxAge: duration * 3600000,
      });

    return token;

  } catch (e) {
    console.log("error with generation token", e);
    return false;
  }
}

//verify if the given token is valid or not 👍
const verify_token = async (token, secret) => {
  try {
    const decoded = jwt.verify(token, secret);

    if(!decoded){
      console.log("not decoded")
      console.log(decoded)
      return {
        success: false
      }
    }
    return {
      success: true,
      ...decoded,
    };

  } catch (e) {
    return {
      success: false,
    };
  }
};

export { generateToken, generateAuthToken, verify_token };
