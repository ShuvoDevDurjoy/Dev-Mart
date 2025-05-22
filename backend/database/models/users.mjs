import { DataTypes, Model } from "sequelize";

export default (sequelize)=>{
    class Users extends Model{
        static associate(models){
            Users.hasMany(models.Orders,{foreignKey : 'user_id'});
        }
    }

    Users.init(
        {
            id : {
                type : DataTypes.UUID,
                allowNull : true,
                primaryKey : true,
                defaultValue : DataTypes.UUIDV4
            },
            name : {
                type : DataTypes.STRING,
                allowNull : false,
            },
            email : {
                type : DataTypes.STRING,
                allowNull : false,
                unique : true
            },
            password : {
                type : DataTypes.STRING,
                allowNull : false,
            },
            is_verified : {
                type : DataTypes.BOOLEAN,
                allowNull : true,
                defaultValue : false
            },
            verification_token : {
                type : DataTypes.STRING,
                allowNull : true
            },
            reset_password_token : {
                type : DataTypes.STRING,
                allowNull : true
            }
        },
        {
            sequelize,
            modelName : 'Users'
        }
    ) ; 

    return Users;
}