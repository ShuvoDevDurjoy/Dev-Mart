import { DataTypes, Model } from "sequelize";

export default (sequelize)=>{
    class OrderItems extends Model{
        static associate(models){
        }
    }

    OrderItems.init({
        order_item_id: {
            type : DataTypes.UUID,
            allowNull : false,
            defaultValue : DataTypes.UUIDV4,
            primaryKey : true
        },
        quantity: {
            type : DataTypes.INTEGER,
            allowNull : false
        }
    },{
        sequelize,
        modelName : 'OrderItem'
    })

    return OrderItems;
}