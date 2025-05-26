import { mergeDefaults } from "sequelize/lib/utils";
import db from "../../database/models/index.mjs";
import product from "../../database/models/product.mjs";

const checkOrder = async (req, res, next)=>{
    try{
      //gets all the ordered product from request body
      var orderProduct = req.body.products;

      const mergedProduct = {};

      
      for(let item of orderProduct){
        const productId = item.id;
        
        if(!mergedProduct[productId]){
          mergedProduct[productId] = {...item};
          mergedProduct[productId].quantity = parseInt(mergedProduct[productId].quantity)
        }
        else{
          mergedProduct[productId].quantity = parseInt(mergedProduct[productId].quantity) + parseInt(item.quantity);
        }
      }
      
      orderProduct = Object.values(mergedProduct);
  
      const size = orderProduct.length;

      if(size===0){
        return res.status(400).json({
          success: false,
          message: "Please Select at least One Product"
        })
      }
  
      var products;

      var validProducts = [];

      var NotFoundProducts = [];

      var inSufficientQuantityProduct = [];
  
      for(let i = 0; i < size; ++i){

        const product = await db.Product.findOne({
          where: {
            product_id: orderProduct[i].id
          }
        })
        
        if(!product){
          NotFoundProducts.push(orderProduct[i].id);
          continue;
        }
  
        products = product.get();

        if(orderProduct[i].quantity > products.available){
          inSufficientQuantityProduct.push(orderProduct[i].id);
          continue;
        }

        product.available = parseInt(product.available) - parseInt(orderProduct[i].quantity);
        await product.save();

        products.order_quantity = orderProduct[i].quantity;

        validProducts.push(products);  
      }


      let s = validProducts.length;

      req.body.validProducts = validProducts;
      req.body.insufficientProduct = inSufficientQuantityProduct;
      req.body.notValidProduct = NotFoundProducts;
      req.body.products = null;

      next()

    }catch(e){
      return res.status(500).json({
        success: false,
        message: "Invalid Request"
      })
    }
  }
  
const uploadToOrdersDB = async(req, res, next)=>{
  try{
      const order = await db.Orders.create({
        user_id: req.body.user_id,
      })

      req.body.order_id = order.order_id;

      next();
  }catch(e){
    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    })
  }
}
  
  const orderDbUpload = async(req, res, next)=>{
    try{
  
  
      const products = req.body.validProducts;
  
      let size = products.length;
  
      const unplace_order = [];
  
      for(let index = 0; index < size; ++index){
        console.log(products[index].order_quantity)
        console.log(products[index])
        const order = await db.SellerOrder.create({
          product_price: products[index].product_price,
          product_quantity: products[index].order_quantity,
          seller_id: products[index].seller_id,
          order_id: req.body.order_id,
          product_id: products[index].product_id,
  
        })
      }
  
      return res.status(200).json({
        success: true,
        message: "Placing Order Successful"
      }
    )

  
    }catch(e){
      console.log(e)
      return res.status(500).json({
        success: false,
        message: "invalid format"
      })
    }
  }


  export {
    checkOrder,
    uploadToOrdersDB,
    orderDbUpload
  }