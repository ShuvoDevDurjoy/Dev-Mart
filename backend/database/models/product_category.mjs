import { DataTypes, Model } from "sequelize"


export default (sequelize)=>{
    class ProductCategory extends Model{
        static associate(models){
            this.hasMany(models.Product,{foreignKey: 'category_id', as: 'product_cat'});
            this.hasMany(models.ProductType, {foreignKey: 'category_id', as: 'product_type'})
        }
    }

    ProductCategory.init({
        category_id: {
            type : DataTypes.UUID,
            allowNull: false,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        category_name: {
            type : DataTypes.STRING(30),
            allowNull : false,
        },
        category_image_link: {
            type : DataTypes.STRING(300),
            allowNull : false,
        }
    },
    {
        sequelize,
        modelName : "ProductCategory"
    })

    return ProductCategory;
}