import { DataTypes, Model } from "sequelize";


export default (sequelize)=>{
    class ProductPrice extends Model{
        static associate(models){
            this.belongsTo(models.Product, {foreignKey: 'product_id', as: 'product'});
            this.belongsTo(models.ProductCurrency, {foreignKey: 'currency_id', as: 'currency'});
        }
    }

    ProductPrice.init({
        id : {
            type : DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        price: {
            type : DataTypes.FLOAT,
            allowNull: false,
        },
        offer_price: {
            type : DataTypes.FLOAT,
            allowNull: false,
        },
        // price_description: {
        //     type : DataTypes.CHAR(50),
        //     allowNull: true,
        // },
        // heighlight_text: {
        //     type : DataTypes.JSON,
        //     allowNull: true,
        // },
    },
    {
        sequelize,
        modelName: "ProductPrice"
    })

    return ProductPrice;
}