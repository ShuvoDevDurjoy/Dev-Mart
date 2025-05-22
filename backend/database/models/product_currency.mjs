import { DataTypes, Model } from "sequelize"


export default (sequelize)=>{
    class Currency extends Model{
        static associate(models){
            this.hasMany(models.ProductPrice, {foreignKey: 'currency_id', as: 'price'});
        }
    }

    Currency.init({
        currency_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
        },
        currency_code: {
            type : DataTypes.CHAR(3),
            allowNull: false,
        },
        exchange_rate: {
            type : DataTypes.FLOAT,
            allowNull: false,
        },
    },{
        sequelize,
        modelName: "Currency"
    })

    return Currency;
}