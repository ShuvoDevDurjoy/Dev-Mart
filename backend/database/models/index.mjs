import { Sequelize } from 'sequelize';
import config from '../../config/config.cjs';
import product from './product.mjs'; // Import product model
import users from './users.mjs';
import orders from './orders.mjs';
import seller from './seller.mjs';
import orderItems from './orderItems.mjs';
import seller_order from './seller_order.mjs';
import product_category from './product_category.mjs';
import product_currency from './product_currency.mjs';
import product_description from './product_description.mjs';
import product_images from './product_images.mjs';
import product_price from './product_price.mjs';
import product_type from './product_type.mjs';
import product_specification from './product_specification.mjs';

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
  host: dbConfig.host,
  dialect: dbConfig.dialect,
  dialectOptions: {
    family: 4
  },
  logging : false
});



// sequelize.sync({force : true}).then(()=>{
//   console.log("synced successfully");
// }).catch(e=>{
//   console.log("sync is not done sucessfully",e.message);
// })

let db = {}; // db object to store all models

async function importModels() {
  console.log("Starting importModels...");

  // Dynamically add the product model to the db object
  db.Product = product(sequelize);  // Pass sequelize instance here
  db.Users = users(sequelize);
  db.Orders = orders(sequelize)
  db.Seller = seller(sequelize);
  db.OrderItem = orderItems(sequelize);
  db.SellerOrder = seller_order(sequelize);
  db.ProductCategory = product_category(sequelize);
  db.ProductCurrency = product_currency(sequelize);
  db.ProductDescription = product_description(sequelize);
  db.ProductImages = product_images(sequelize);
  db.ProductPrice = product_price(sequelize);
  db.ProductSpecification = product_specification(sequelize);
  db.ProductType = product_type(sequelize);

  console.log("Loaded models:", Object.keys(db)); // Log loaded models

  db.sequelize = sequelize; // Attach sequelize to db
  db.Sequelize = Sequelize; // Attach Sequelize to db

  // Call associate if it exists for each model
  Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
      console.log(db[modelName]);
      db[modelName].associate(db);
    }
  });
}

await importModels();

export default db;
