import { DataTypes, Model } from "sequelize";


export default (sequelize)=>{
    class ProductDescription extends Model{
        static associate(models){
            this.belongsTo(models.Product, {foreignKey: 'product_id', as: 'product'});
        }
    }

    ProductDescription.init({
        id: {
            type : DataTypes.STRING(70),
            allowNull : true,
            primaryKey : true
        },
        product_name: {
            type : DataTypes.STRING,
            allowNull : false,
        },
        product_description: {
            type : DataTypes.TEXT,
            allowNull: false,
        },
        // keyWords: {
        //     type : DataTypes.STRING,
        //     allowNull : true,
        // },
        // highlights: {
        //     type : DataTypes.JSON,
        //     allowNull : true,
        // },
        // meta_description: {
        //     type : DataTypes.STRING,
        //     allowNull : true,
        // },
        // title: {
        //     type: DataTypes.STRING,
        //     allowNull: true,
        // }
    },
    {
        sequelize,
        modelName: "ProductDescription"
    })

    return ProductDescription;
}