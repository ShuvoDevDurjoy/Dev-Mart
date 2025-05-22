import { DataTypes, Model } from "sequelize";


export default (sequelize)=>{
    class ProductType extends Model{
        static associate(models){
            this.belongsTo(models.ProductCategory, {foreignKey: 'category_id', as: 'category_name'});
            this.hasMany(models.Product, {foreignKey: 'product_type_id', as: 'products'});
        }
    }

    ProductType.init({
        product_type_id:{
            type : DataTypes.STRING,
            allowNull : true,
            primaryKey : true
        },
        type_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        type_image: {
            type : DataTypes.STRING,
            allowNull: false,
        },
        type_link: {
            type : DataTypes.STRING,
            allowNull : false
        }
    },{
        sequelize,
        modelName: "ProductType"
    })

    return ProductType;
}