import { Router } from "express";
import { ProductImageSaving, github_upload } from "../config/multer.config.js";
import {
  checkCategoryId,
  checkCategoryName,
  checkProductId,
  checkTypeName,
  githubUpload,
  checkProduct,
  productDbUpload,
  removingProductFromDatabase,
  removingProductFromStaticDirectory,
  removingProductImageFromGithub,
  saveProductImageLocally,
  selectingProductImageToRemove,
} from "../middleware/product.middleware.js";
import axios from "axios";
import { __dir } from "../config/__dir.config.js";
import { removeAllProductFromDatabaseQuery } from "../config/db.config.js";
import path from "path";
import fs from "fs";
import db from "../database/models/index.mjs";
import { githubMultipleUpload } from "../utils/githubImageSave.js";
import {
  checkCategoryIdDB,
  checkCategoryNameDB,
  checkCurrency,
  checkdbProduct,
  checkProductCredentials,
  checkTypeNameDB,
  getAll,
  getCategory,
  getCategoryWithId,
  retrieveProductFromDatabase,
  saveCategoryNameDB,
  saveTypeDb,
  uploadProductDb,
} from "../controllers/User/product.controller.js";
import { checkSellerAuthToken } from "../middleware/authSeller.middleware.js";
import { dbSellerVerification } from "../controllers/User/seller.controller.js";

const product = Router();


//save product category to database
product.post("/set_category",
  github_upload.single("category_image"),
  checkSellerAuthToken,
  dbSellerVerification,
  checkCategoryName,
  checkCategoryNameDB,
  githubUpload,
  saveCategoryNameDB,
  (req, res)=>{
    return res.status(201).json({
      success: true,
      message: "Category Upload Successfull"
    })
  }
);

//save product type to database
product.post('/add_type',
  github_upload.single('type_image'),
  checkSellerAuthToken,
  dbSellerVerification,
  checkTypeName,
  checkTypeNameDB,
  checkCategoryId,
  checkCategoryIdDB,
  githubUpload,
  saveTypeDb,
  (req, res)=>{
  return res.status(200).json({
    success: true,
    message: "Product Type Upload Successfull"
  })
});

//adding product to the database
product.post(
  "/add_product",
  github_upload.array("product_images", 10),
  checkSellerAuthToken,
  dbSellerVerification,
  checkProduct,
  checkProductCredentials,
  githubMultipleUpload,
  uploadProductDb,
  async (req, res) => {
    return res.json({
      success: true,
      message: "Product Upload Successfull",
    });
  }
);



// product.post("/api/v1/set_type",
//   github_upload.single("type_image"),
//   checkType,
//   githubUpload,
//   saveTypeDb,
//   async (req, res) => {
//     return res.send({
//       success: true,
//       message: "Type Upload Successfull",
//     });
//   }
// );

product.get(
  "/get_product",
  checkdbProduct
)




//getting all the products from database
product.get("/api/product_all", retrieveProductFromDatabase);

product.get("/products",getAll);

product.get('/categories',getCategory)

product.get('/get_categories_with_id', getCategoryWithId);


product.get('/get_currency', checkCurrency);

//removing product from database
product.delete(
  "/remove/product_id/:product_id",
  selectingProductImageToRemove,
  removingProductImageFromGithub,
  removingProductFromStaticDirectory,
  removingProductFromDatabase,
  (req, res) => {
    return res.json({
      success: true,
      message: "Product Successfully Deleted",
    });
  }
);

product.delete("/remove_all/products", async (req, res) => {
  try {
    const headers = {
      Authorization: `Bearer ${process.env.GITHUB_ACCESS_TOKEN}`,
      "Content-Type": "application/vnd.github+json",
    };

    console.log(headers);

    const url = `https://api.github.com/repos/${process.env.GITHUB_USER}/${process.env.GITHUB_PRODUCT_IMAGE_REPO}/contents/${process.env.GITHUB_PRODUCT_IMAGE_PATH_PREFIX}`;

    const feached = await axios.get(url, { headers });

    // Use for...of to handle async/await properly
    for (const element of feached.data) {
      let data = {
        message: `Removing ${element.path}`,
        sha: element.sha,
        branch: process.env.GIT_BRANCH,
      };

      console.log(`To remove: ${element.path}`);

      // Make the delete request
      await axios.delete(
        `https://api.github.com/repos/${process.env.GITHUB_USER}/${process.env.GITHUB_PRODUCT_IMAGE_REPO}/contents/${element.path}`,
        { data, headers }
      );
    }

    return res.send({
      success: true,
      message: "Removing All Successful",
    });
  } catch (e) {
    console.log("Error while removing:", e.message);
    return res.send({
      success: false,
      message: "Removing is not successful",
    });
  }
});

product.delete("/remove_all/products", async (req, res) => {
  try {
    const headers = {
      Authorization: `Bearer ${process.env.GITHUB_ACCESS_TOKEN}`,
      "Content-Type": "application/vnd.github+json",
    };

    console.log(headers);

    const url = `https://api.github.com/repos/${process.env.GITHUB_USER}/${process.env.GITHUB_PRODUCT_IMAGE_REPO}/contents/${process.env.GITHUB_PRODUCT_IMAGE_PATH_PREFIX}`;

    const feached = await axios.get(url, { headers });

    // Use for...of to handle async/await properly
    console.log(feached.data.length);
    if (feached.data.length > 0) {
      for (const element of feached.data) {
        let data = {
          message: `Removing ${element.path}`,
          sha: element.sha,
          branch: process.env.GIT_BRANCH,
        };

        console.log(`To remove: ${element.path}`);

        // Make the delete request
        await axios.delete(
          `https://api.github.com/repos/${process.env.GITHUB_USER}/${process.env.GITHUB_PRODUCT_IMAGE_REPO}/contents/${element.path}`,
          { data, headers }
        );
      }
    }

    return res.send({
      success: true,
      message: "Removing All Successful",
    });
  } catch (e) {
    console.log("Error while removing:", e.message);
    return res.send({
      success: false,
      message: "Removing is not successful",
    });
  }
});

product.delete("/remove_all/database", async (req, res) => {
  try {
    const product = db.Product.destroy({ where: {} });
  } catch (e) {
    console.log("err", e);
    return res.send({
      success: false,
      message: "database failure",
    });
  }
  return res.send({
    success: true,
    message: "successfull",
  });
});

product.delete("/remove_all/file_system", async (req, res) => {
  try {
    const dirPath = path.join(__dir, "public", "static");
    fs.readdir(dirPath, (err, files) => {
      if (err) {
        return console.log(`Error reading directory: ${err}`);
      }
      files.forEach((file) => {
        const filePath = path.join(dirPath, file);
        fs.unlink(filePath, (err) => {
          if (err) {
            return console.log(`Error removing file: ${err}`);
          }
          console.log(`${filePath} removed successfully`);
        });
      });
    });
  } catch (e) {
    console.log("err", e.message);
    return res.send({
      success: false,
      message: "Error with removing file from teh file system",
    });
  }
  return res.send({
    success: true,
    message: "successfull",
  });
});

product.get("/product_amazon", async (req, res) => {
  try {
    const url = "https://real-time-amazon-data.p.rapidapi.com/product-details";
    const options = {
      params: {
        asin: "B07NRXD3XG",
        limit: "100",
        page: "1",
      },
      headers: {
        "x-rapidapi-key": "1c72a6803amsh409f6c2f2ae13d1p183014jsnd234cb7b17c0",
        "x-rapidapi-host": "real-time-amazon-data.p.rapidapi.com",
      },
    };
    const data = await axios.get(url, options);
    // console.log('data is : ',data);
    return res.send(data.data);
  } catch (e) {
    console.log(e.message);
    return res.json({
      success: e,
      message: "Internal Server lost",
    });
  }
});


product.get('/:product_id',checkProductId, checkdbProduct);

export default product;
