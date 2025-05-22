import axios from "axios";
import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { __dir } from "../config/__dir.config.js";
import { connections } from "../db/configurations.db.js";
import {
  removeProductFromDatabaseQuery,
  removeProductImageFromLocalDirectoryQuery,
  retrieveProductFromDatabaseQuery,
  savingProductQuery,
} from "../config/db.config.js";
import { v4 as uuidv4 } from "uuid";

import db from "../database/models/index.mjs";
import { Console } from "console";





const githubUpload = async (req, res, next) => {
  try {
    const file = req.file;

    const fileExtensionName = path.extname(file.originalname);

    const fileDirectoryName = `${Date.now()}-${Math.random() * 1e6}${fileExtensionName}`;

    const gitfilename = `${process.env.GITHUB_IMAGE_PATH_PREFIX}${fileDirectoryName}`;
    const fileBase64 = file.buffer.toString("base64");

    const data = {
      message: `Add File ${gitfilename}`,
      content: fileBase64,
      branch: process.env.GIT_BRANCH,
    };

    const headers = {
      Authorization: `Bearer ${process.env.GITHUB_ACCESS_TOKEN}`,
      "Content-Type": "application/vnd.github+json",
    };

    const deployURL = `https://api.github.com/repos/${process.env.GITHUB_USER}/${process.env.GITHUB_IMAGE_REPO}/contents/${gitfilename}`;

    const response = await axios.put(deployURL, data, { headers });

    req.body.dbGitFileName = `https://raw.githubusercontent.com/${process.env.GITHUB_USER}/${process.env.GITHUB_IMAGE_REPO}/${process.env.GIT_BRANCH}/${gitfilename}`;
    req.body.filename = fileDirectoryName;
    next();
  } catch (e) {
    console.log(e);
    return res.send({
      success: false,
      message: "github upload failed",
    });
  }
};


const saveProductImageLocally = (req, res, next) => {
  try {

    const localDirPath = path.join(
      __dir,
      process.env.PRODUCT_IMAGE_SAVING_DIRECTORY,
      req.body.filename
    );

    fs.writeFile(localDirPath, req.file.buffer, (err) => {
      if (err) {
        return res.send({
          success: false,
          message: "Internal Server Error",
        });
      }
    });

    req.body.dbLocalUrl = `${process.env.PRODUCT_IMAGE_SAVING_DIRECTORY}/${req.body.filename}`;
    next();
  } catch (e) {
    return res.send({
      success: false,
      message: "Internal Server Error",
    });
  }
};


const productDbUpload = async (req, res, next) => {
  try {

    const product = await db.Product.create({
      product_id : uuidv4(),
      seller_id : uuidv4(),
      product_category : req.body.product_category,
      product_name : req.body.product_name,
      product_price : req.body.product_price,
      product_availability : req.body.product_available,
      product_quantity : req.body.product_quantity,
      product_unit : req.body.product_unit,
      product_filename : req.body.filename,
      product_github_image_link  : req.body.dbGitFileName,
      product_local_image_link : req.body.dbLocalUrl,
      product_description : req.body.product_description||"No description available",
     });
    next();
  } catch (e) {
    return res.send({
      success: false,
      message: "Internal Server Error",
    });
  }
};




const selectingProductImageToRemove = async (req, res, next) => {
  try {
    const product = await db.Product.findOne({where:{product_id : req.params.product_id}});

    req.body.filename = product.product_filename


    if(!req.body.filename){
      console.log("not selected");
      return res.send({
        success : false,
        message : "Internal Server Error"
      })
    }

    next();

    
  } catch (e) {
    console.log("This is a error in the removing product ", e.message);
    return res.send({
      success: false,
      message: "File Does Not Exists",
    });
  }
  // next();

  
};

const removingProductFromStaticDirectory = async (req, res,next) => {
  try{
    fs.unlink(
      `${__dir}/${process.env.PRODUCT_IMAGE_SAVING_DIRECTORY}/${req.body.filename}`,
      (err) => {
        if (err) {
          console.log("An Error Occured");
        }
      }
    );
    next();
  }catch(e){
    return res.send({
      success : false,
      message : "Internal Server Error"
    })
  }
};

const removingProductImageFromGithub = async(req,res,next)=>{
  try{

    const headers  = {
      Authorization : `Bearer ${process.env.GITHUB_ACCESS_TOKEN}`,
      'Content-Type' : 'application/vnd.github+json'
    }

    let data = {
      message : `Deleting image ${process.env.GITHUB_PRODUCT_IMAGE_PATH_PREFIX}/${req.body.filename}`,
      branch : process.env.GIT_BRANCH
    }


    const imageUrl = `https://api.github.com/repos/${process.env.GITHUB_USER}/${process.env.GITHUB_PRODUCT_IMAGE_REPO}/contents/${process.env.GITHUB_PRODUCT_IMAGE_PATH_PREFIX}${req.body.filename}`;


    const feachingData = await axios.get(imageUrl, {headers});

    data = {
      ...data,
      sha : feachingData.data.sha
    }


    await axios.delete(imageUrl,{data,headers});

    next();
    
  }catch(e){
    return res.send({
      success : false,
      message : "Internal Server Error"
    })
  }
}

const removingProductFromDatabase = async(req,res,next)=>{
  try{

    const destroyed = await db.Product.destroy({where : { product_id : req.params.product_id }})

    next();
    
  }catch(e){
    return res.json({
      success : false,
      message : "Internal Server Error"
    })
  }
}


const checkProductId = async(req, res, next)=>{
  try{
    const {product_id} = await req.params;

    console.log('product id is : ',product_id);

    if(!product_id){
      return req.status(400).json({
        success: false,
        message: "Invalid Request"
      })
    }

    next()
  }catch(e){
    return res.json(500).status({
      success: false,
      message: "Internal Server Error"
    })
  }
}

export {
  githubUpload,
  saveProductImageLocally,
  productDbUpload,
  selectingProductImageToRemove,
  removingProductFromStaticDirectory,
  removingProductImageFromGithub,
  removingProductFromDatabase,
  checkProductId
};
