import { DataTypes, Model } from "sequelize";

export default (sequelize)=>{
  class Product extends Model{
    static associate(models){
      this.belongsTo(models.ProductCategory, {foreignKey: 'category_id', as: "category"});
      this.belongsTo(models.ProductType, {foreignKey: 'product_type_id', as: 'type'});
      this.hasOne(models.ProductDescription, {foreignKey: 'product_id', as: 'description'});
      this.hasOne(models.ProductPrice, {foreignKey: 'product_id', as: 'price'});
      this.hasMany(models.ProductImages, {foreignKey: 'product_id', as: 'images'});
      this.belongsTo(models.Seller, {foreignKey: 'seller_id', as: 'seller'});
    }
  };

  Product.init({
    product_id :{
      type : DataTypes.UUID,
      allowNull : false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey : true
    },
    product_name: {
      type: DataTypes.STRING,
      allowNull : false,
    },
    product_category: {
      type: DataTypes.STRING,
      allowNull : false
    },
    product_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    product_price:{
      type: DataTypes.FLOAT, 
      allowNull: false
    },
    currency_code: {
      type: DataTypes.STRING(5),
      allowNull: false,
    },
    available: {
      type: DataTypes.INTEGER,
      allowNull : false,
    },
    visible: {
      type : DataTypes.BOOLEAN,
      allowNull : true,
      defaultValue : true
    },
    sortOrder: {
      type: DataTypes.INTEGER,
      allowNull : true,
      defaultValue : 5
    },
    rating: {
      type : DataTypes.FLOAT,
      allowNull : true,
    },
    ratingCount: {
      type : DataTypes.INTEGER,
      allowNull : true
    }
  },
  {
    sequelize,
    modelName: "Product"
  })

  return Product;
}