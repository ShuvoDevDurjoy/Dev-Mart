    import { DataTypes, Model } from "sequelize";

export default (sequelize)=>{
    class Orders extends Model{
        static associate(models){
            Orders.belongsTo(models.Users,{foreignKey : 'user_id', as: 'user'});
            Orders.hasMany(models.SellerOrder,{foreignKey : 'order_id', as: 'seller_orders'});
        }
    }

    Orders.init({
        order_id : {
            type : DataTypes.UUID,
            allowNull : false,
            defaultValue : DataTypes.UUIDV4,
            primaryKey : true
        },
        // total_amount : {
        //     type : DataTypes.INTEGER,
        //     allowNull : false,
        // },
        // currency : {
        //     type : DataTypes.STRING,
        //     allowNull : false,
        // },
        // delivery_localtion : {
        //     type : DataTypes.STRING,
        //     allowNull : false
        // },
        // order_status : {
        //     type : DataTypes.ENUM(['Pending','Delivered','Cancelled','Refunded']),
        //     allowNull : false,
        //     defaultValue : 'Pending'
        // },
        // payment_status : {
        //     type : DataTypes.ENUM(['Pending','Failed','Refunded','Completed','Cancelled']),
        //     allowNull : false,
        //     defaultValue : 'Pending'
        // },
        // payment_method : {
        //     type : DataTypes.ENUM('credit_card','cash_on_delivery'),
        //     allowNull : false,
        //     defaultValue : 'credit_card'
        // }
    },
    {
        sequelize,
        modelName : 'Orders'
    });

    return Orders ; 
}