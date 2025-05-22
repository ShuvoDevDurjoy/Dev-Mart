import { DataTypes, Model } from "sequelize";


export default (sequelize)=>{
    class ProductSpecification extends Model{
        static associate(models){}
    }

    ProductSpecification.init({
        id: {
            type : DataTypes.INTEGER,
            allowNull : false,
            primaryKey : true
        },
        width: {
            type: DataTypes.FLOAT,
            allowNull: true,
        },
        height: {
            type: DataTypes.FLOAT,
            allowNull: true,
        },
        weight: {
            type : DataTypes.FLOAT,
            allowNull: true,
        },
        weight_unit: {
            type : DataTypes.CHAR(10),
            allowNull: false,
        },
        dimension_unit: {
            type : DataTypes.CHAR(10),
            allowNull: false,
        },
        model: {
            type : DataTypes.CHAR(100),
            allowNull: true,
        },
        manufacturer: {
            type : DataTypes.CHAR(100),
            allowNull: true,
        },
    },
    {
        sequelize,
        modelName: "ProductSpecification"
    })

    return ProductSpecification;
}