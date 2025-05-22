import { DataTypes, Model } from "sequelize";


export default (sequelize)=>{
    class ProductGroup extends Model{
        static associate(models){

        }
    }

    ProductGroup.init({
        id: {
            type : DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        type_image:{
            type: DataTypes.STRING,
            allowNull: false,
        }
    })
}