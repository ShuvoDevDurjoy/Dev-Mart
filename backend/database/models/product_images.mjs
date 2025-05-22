import { DataTypes, Model } from "sequelize";


export default (sequelize)=>{
    class ProductImages extends Model{
        static associate(models){
            this.belongsTo(models.Product, {foreignKey: 'product_id', as: 'product'});
        }
    }

    ProductImages.init({
        product_image_id: {
            type : DataTypes.STRING(60),
            allowNull: false,
            primaryKey: true,
        },
        image_links: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        sequelize,
        modelName: "ProductImages"
    })

    return ProductImages;
}