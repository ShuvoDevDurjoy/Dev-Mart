import db from "../../database/models/index.mjs";

const checkOrder = async (req, res, next)=>{
    try{
      const orderProduct = req.body.products;
  
      const size = orderProduct.length;
  
      var products;
  
      for(let i = 0 ; i < size ; ++i){
        const product = await db.Product.findOne({
          where: {
            product_id: orderProduct[i].id
          }
        })
        
        if(!product){
          return res.status(404).json({
            success: false,
            message: "Product not Found"
          })
        }
  
        products = product.get();
        if(orderProduct[i].quantity > products.available){
          return res.status(400).json({
            success: false,
          })
        }
  
        orderProduct[i].name = products.product_name;
        orderProduct[i].seller_id = products.seller_id;
        //price_calculation
  
        const u_currency_id = req.body.currency_code;
  
        const exchange_rate = await db.ProductCurrency.findOne({
          where: {
            currency_id: u_currency_id
          }
        });
  
        orderProduct[i].price = (parseFloat(products.product_price) * parseFloat(orderProduct[i].quantity));
  
      }
  
      next();
  
    }catch(e){
      console.log(e);
      return res.status(500).json({
        success: false,
        message: "Invalid Request"
      })
    }
  }
  
  
  const orderDbUpload = async(req, res, next)=>{
    try{
  
      //place the order in the order table
      const order = await db.Orders.create({
        user_id: req.body.user_id
      })
  
      if(!order){
        return res.status(400).json({
          success: false,
          message: "Invalid Request"
        })
      }
      
      const order_id = order.get().order_id;
  
      const products = req.body.products;
  
      let size = products.length;
  
      const unplace_order = [];
  
      for(let index = 0; index < size; ++index){
        const order = await db.SellerOrder.create({
          product_price: products[index].price,
          product_quantity: products[index].quantity,
          seller_id: products[index].seller_id,
          order_id: order_id,
          product_id: products[index].id,
  
        })
  
        if(!order){
          unplace_order.push(products[index])
        }
      }
  
      return res.status(200).json({
        success: true,
        message: "Placing Order Successful"
      })
  
    }catch(e){
      return res.status(500).json({
        success: false,
        message: "invalid format"
      })
    }
  }


  export {
    checkOrder,
    orderDbUpload
  }