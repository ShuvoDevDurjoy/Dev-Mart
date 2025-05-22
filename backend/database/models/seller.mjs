import { DataTypes, Model } from "sequelize";

export default (sequelize)=>{
    class Seller extends Model{
        static associate(models){
            Seller.hasMany(models.Product,{foreignKey : 'seller_id', as: 'products'});
            Seller.hasMany(models.SellerOrder,{foreignKey : 'seller_id'});
        }
    }

    Seller.init({
        seller_id : {
            type : DataTypes.UUID,
            allowNull : false,
            defaultValue : DataTypes.UUIDV4,
            primaryKey : true
        },
        seller_name : {
            type : DataTypes.STRING,
            allowNull : false
        },
        business_name: {
            type : DataTypes.STRING,
            allowNull : false
        },
        seller_email : {
            type : DataTypes.STRING,
            allowNull : false
        },
        seller_password : {
            type : DataTypes.STRING,
            allowNull : false
        },
        email_verification_token : {
            type : DataTypes.STRING,
            allowNull : true
        },
        reset_password_token : {
            type : DataTypes.STRING,
            allowNull : true
        },
        is_verified : {
            type : DataTypes.BOOLEAN,
            allowNull : false,
            defaultValue : false
        }
    },
    {
        sequelize,
        modelName : 'Seller'
    })

    return Seller;
}