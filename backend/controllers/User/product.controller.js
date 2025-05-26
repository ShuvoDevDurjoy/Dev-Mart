//import directories
import db from "../../database/models/index.mjs";
import { v4 as uuidv4 } from "uuid";
import { __dir } from "../../config/__dir.config.js";
import product from "../../database/models/product.mjs";



//checks if the category name is in database or not
const checkCategoryNameDB = async (req, res, next) => {
  try {
    //check if category name is already in database or not
    const existing = await db.ProductCategory.findOne({
      where: {
        category_name: req.body.category_name,
      },
    });

    if (existing) {
      return res.status(409).json({
        seccess: false,
        message: "Category Already Exists",
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

const checkCategoryIdDB = async(req, res, next)=>{
  try{

    const existing = await db.ProductCategory.findOne({
      where: {
        category_id: req.body.category_id
      }
    })
    
    if(!existing){
      return res.status(400).json({
        success: false,
        message: "Invalid Category"
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

//save the uploaded category to database 
const saveCategoryNameDB = async (req, res) => {
  try {
    //check if category field is present or not
    const { category_name, dbGitFileName } = req.body;
    if (!category_name || !dbGitFileName) {
      return res.status(400).json({
        success: false,
        message: "Invalid Request",
      });
    }

    //if category field is present
    const categoryDb = await db.ProductCategory.create({
      category_name: category_name,
      category_image_link: dbGitFileName,
    });

    if (!categoryDb) {
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }

    const io = req.app.get("io");

    const categoryAttributes = await db.ProductCategory.findAll({
      attributes: ["category_id", "category_name"],
      include: [
        {
          model: db.ProductType,
          as: "product_type",
          attributes: ["product_type_id", "type_name"],
        },
      ],
    });

    await io.emit("new-category", categoryAttributes);

    return res.status(200).json({
      success: true,
      message: "Successfull",
    });
  } catch (e) {

    if (e.name === "SequelizeUniqueConstraintError") {
    return res.status(409).json({
      success: false,
      message: "Category Already Exists"
    });
  }
    return res.status(400).json({
      success: false,
    });
  }
};


//checks type name if this is in database or not
const checkTypeNameDB = async(req, res, next)=>{
  try{
    //if type name is not null check if type name is already in database or not

    const existing = await db.ProductType.findOne({
      where: {
        type_name: req.body.type_name,
      },
    });

    if (existing) {
      return res.status(209).json({
        success: false,
        message: "Type Already Exists",
      });
    }

    next();
  }catch(e){
    return res.status(500).json({
      success: false,
      messag: "Internal Server Error"
    })
  }
}

//saves new type name in database
const saveTypeDb = async (req, res, next) => {
  try {
    const { type_name, category_id, dbGitFileName } = req.body;

    const type = await db.ProductType.create({
      product_type_id: uuidv4(),
      type_name: type_name,
      type_image: dbGitFileName,
      category_id: category_id,
      type_link: "/",
    });

    if (!type) {
      return res.stauts(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }

    type.type_link = `/product/get_type/${type.product_type_id}`
    await type.save();

    next();
  } catch (e) {
    return res.send({
      success: false,
      message: "Internal Server Error",
    });
  }
};


const checkProductCredentials = async (req, res, next) => {
  try {
    var success;
    //check if Category id is correct or not
    success = await checkDatabaseCredentials(
      "ProductCategory",
      {
        category_id: req.body.product_category_id,
      },
      [
        {
          type: "category_name",
          value: "category_name",
        },
      ],
      req,
      res
    );

    if (!success) {
      return res.status(404).json({
        success: false,
      });
    }

    //check if product type is correct or not
    success = await checkDatabaseCredentials(
      "ProductType",
      {
        product_type_id: req.body.product_type_id,
      },
      [
        {
          type: "type_name",
          value: "type_name",
        },
      ],
      req,
      res
    );

    if (!success) {
      return res.status(404).json({
        success: false,
      });
    }

    //check if given currency id is correct or not
    const exchange_rate = await db.ProductCurrency.findOne({
      where: {
        currency_id: req.body.product_currency_id,
      },
    });

    if (!exchange_rate) {
      return res.status(404).json({
        success: false,
      });
    }

    const calculatedPrice =
      parseFloat(req.body.product_price) /
      parseFloat(exchange_rate.get().exchange_rate);

    req.body.product_price = calculatedPrice;
    req.body.currency_code = process.env.DEFAULT_CURRENCY_CODE;
    req.body.currency_id = process.env.DEFAULT_CURRENCY_ID;

    success = await checkDatabaseCredentials(
      "Seller",
      {
        seller_id: req.body.seller_id,
      },
      [],
      req,
      res
    );

    if (!success) {
      return res.status(404).json({
        success: false,
      });
    }
    console.log("returning");

    next();
  } catch (e) {
    console.log(e);
    return res.status(404).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const uploadProductDb = async (req, res, next) => {
  try {
    //retrieve all the data from the request body
    const {
      product_name,
      product_category_id,
      product_type_id,
      product_description,
      product_price,
      seller_id,
      category_name,
      type_name,
      currency_id,
      currency_code,
      image_files,
      product_available,
    } = req.body;

    var result;

    // upload the product to the database
    result = await uploadProductReleatedCredentials(
      "Product",
      {
        product_name: product_name,
        product_category: category_name,
        product_type: type_name,
        product_price: product_price,
        currency_code: currency_code,
        available: product_available,
        visible: true,
        sortOrder: 1,
        rating: 0,
        ratingCount: 0,
        category_id: product_category_id,
        product_type_id: product_type_id,
        seller_id: seller_id,
      },
      "product_id"
    );

    if (result.success === false) {
      return res.status(500).json({
        success: false,
        message: "product Upload Failed",
      });
    }

    const product_id = result.id;

    var un_id = uuidv4();

    const description_id = "product_desc" + un_id;

    result = await uploadProductReleatedCredentials("ProductDescription", {
      id: description_id,
      product_name: product_name,
      product_description: product_description,
      product_id: product_id,
    });

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: "Invalid Request",
      });
    }

    let image_size = image_files.length;
    console.log(image_size);

    for (let index = 0; index < image_size; ++index) {
      const product_image_id = `product_image_${un_id}_${index + 1}`;
      console.log(product_image_id);
      result = await uploadProductReleatedCredentials("ProductImages", {
        product_image_id: product_image_id,
        image_links: image_files[index],
        product_id: product_id,
      });

      if (!result.success) {
        return res.status(500).json({
          success: false,
          message: "Invalid Request",
        });
      }
    }

    result = await uploadProductReleatedCredentials("ProductPrice", {
      price: product_price,
      offer_price: product_price,
      product_id: product_id,
      currency_id: currency_id,
    });

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }

    next();
  } catch (e) {
    console.log(e.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const retrieveProductFromDatabase = async (req, res) => {
  try {
    // const product = await db.Product.findAll({
    //   include: [
    //     {
    //       model: db.ProductImages,
    //       as: "images",
    //       attributes: ["product_image_id", "image_links"],
    //     },
    //   ],
    // });

    // const connection = await connections.getConnection();
    // if(!connection){
    //   console.log("Connection not found");
    //   return res.status(500).json({
    //     success: false,
    //     message: "internal Server Error"
    //   })
    // }

    const product = await db.ProductCategory.findAll({
      attributes: ["category_id", "category_name", "category_image_link"],
      include: [
        {
          model: db.ProductType,
          as: "product_type",
          attributes: [
            "product_type_id",
            "type_name",
            "type_image",
            "type_link",
          ],
          include: [
            {
              model: db.Product,
              as: "products",
              attributes: [
                "product_id",
                "product_name",
                "product_price",
                "currency_code",
                "available",
                "seller_id",
              ],
              include: [
                {
                  model: db.ProductImages,
                  as: "images",
                  attributes: ["product_image_id", "image_links"],
                  limit: 1,
                },
              ],
            },
          ],
        },
      ],
    });

    console.log(product);
    return res.send({
      success: true,
      products: product,
    });
  } catch (e) {
    console.log("Error with retrieving");
    return res.send({
      success: false,
      message: "Internal Server Error",
    });
  }
};






const getCategoryWithProduct = async (req, res) => {
  try {
    const categoryAttributes = await db.ProductCategory.findAll({
      attributes: ["category_id", "category_name"],
      include: [
        {
          model: db.ProductType,
          as: "product_type",
          attributes: ["product_type_id", "type_name"],
        },
      ],
    });
    if (!categoryAttributes) {
      return res.status(400).json({
        success: false,
        message: "Invalid Request",
      });
    }

    return res.status(200).json({
      success: true,
      category: categoryAttributes,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      success: false,
      message: "Internal Server Failure",
    });
  }
};




const checkDatabaseCredentials = async (
  tablename,
  values,
  attributes,
  req,
  res
) => {
  try {
    const existing = await db[tablename].findOne({
      where: { ...values },
    });

    if (!existing) {
      return false;
    }

    attributes.forEach((attribute) => {
      req.body[attribute.type] = existing.get()[attribute.value];
    });

    return true;
  } catch (e) {
    return false;
  }
};

const uploadProductReleatedCredentials = async (tableName, values, id_name) => {
  try {
    const result = await db[tableName].create(values);
    if (!result) {
      return {
        success: false,
      };
    }

    return {
      success: true,
      id: result.get()[id_name],
    };
  } catch (e) {
    console.log("Error with uploading", tableName);
    console.log(e);
    return {
      success: false,
    };
  }
};

const checkdbProduct = async (req, res, next) => {
  try {
    var {lang, cur_id } = req.query;
    console.log("inside the check db")

    
    
    const {product_id} = await req.params;
    
    if (!product_id) {
      return res.status(400).json({
        success: false,
        message: "Invalid Request",
      });
    }

    if (!lang) {
      lang = "en";
    }

    console.log("product id is ",product_id)

    if (!cur_id) {
      cur_id = 1;
    }
    const db_product = await db.Product.findOne({
      where: {
        product_id: product_id,
      },
      include: [
        {
          model: db.ProductDescription,
          as: "description",
        },
        {
          model: db.ProductPrice,
          as: "price",
        },
        {
          model: db.ProductImages,
          as: "images",
        }
      ],
    });

    console.log(db_product);

    if (!db_product) {
      return res.status(404).json({
        success: false,
        message: "Product Not Found",
      });
    }

    const product = db_product.get();

    const default_curr_code = 1;

    const exchange_rate1 = await db.ProductCurrency.findOne({
      where: {
        currency_id: product.price.currency_id,
      },
    });

    if (!exchange_rate1) {
      return res.status(404).json({
        success: false,
      });
    }

    var actual_price = product.product_price;
    actual_price = parseFloat(actual_price);
    actual_price =
      actual_price / parseFloat(exchange_rate1.get().exchange_rate);

    const exchangeRate2 = await db.ProductCurrency.findOne({
      where: {
        currency_id: cur_id,
      },
    });

    var exchanged_price =
      actual_price * parseFloat(exchangeRate2.get().exchange_rate);
    exchanged_price = exchanged_price.toFixed(2);

    product.product_price = exchanged_price;
    product.currency_code = exchangeRate2.get().currency_code;
    product.price.price = exchanged_price;
    product.price.offer_price = exchanged_price;
    product.price.currency_id = cur_id;

    return res.status(200).json({
      success: true,
      product: product,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const checkCurrency = async (req, res) => {
  try {
    const currencies = await db.ProductCurrency.findAll({
      attributes: ["currency_id", "currency_code"],
    });

    if (!currencies) {
      return res.status(400).json({
        success: false,
        message: "Internal Server Error",
      });
    }

    return res.status(200).json({
      success: true,
      currencies: currencies,
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const getAll = async (req, res) => {
  const { category_id, type_id, page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  const where = {};
  if (category_id) where.category_id = category_id;
  if (type_id) where.product_type_id = type_id;

  try {
    const { count, rows } = await db.Product.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      include: [
        { model: db.ProductImages, as: "images", limit: 1 },
        { model: db.ProductCategory, as: "category" },
        { model: db.ProductType, as: "type" },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json({ success: true, data: rows, total: count });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const getCategory = async(req, res)=>{
  const categories = await db.ProductCategory.findAll({
    include: {
      model: db.ProductType,
      as: 'product_type',
    },
  });
  return res.status(200).json({ success: true, data: categories });
}

const getCategoryWithId = async(req, res)=>{
  try{
    const categories = await db.ProductCategory.findAll({
      attributes: ['category_id', 'category_name']
    })

    if(!categories){
      return res.status(400).json({
        success: false,
        message: "Invalid Request"
      })
    }

    return res.status(200).json({
      success: true,
      categories : categories
    })
  }catch(e){
    console.log("Error with fetching category from database");
    return res.status(500).json({
      success: false,
      message: "Internal Server Failure"
    })
  }
}

export {
  checkProductCredentials,
  uploadProductDb,
  retrieveProductFromDatabase,

  //controller related to setting up category
  checkCategoryNameDB,
  checkCategoryIdDB,
  saveCategoryNameDB,
  getCategoryWithProduct,

  //controller related to setting up type
  checkTypeNameDB,
  saveTypeDb,
  checkdbProduct,

  //currency
  checkCurrency,
  getAll,
  getCategory,
  getCategoryWithId
};
