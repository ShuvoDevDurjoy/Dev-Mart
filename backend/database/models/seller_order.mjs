import { DataTypes, Model } from "sequelize";

export default (sequelize)=>{
    class SellerOrder extends Model{
        static associate(models){
            SellerOrder.belongsTo(models.Product,{foreignKey : 'product_id', as: 'product'});
            SellerOrder.belongsTo(models.Seller,{foreignKey : 'seller_id', as: 'seller'});
            SellerOrder.belongsTo(models.Orders,{foreignKey : 'order_id', as: 'orders'});
        }
    }

    SellerOrder.init({
        seller_order_id : {
            type : DataTypes.UUID,
            allowNull : false,
            defaultValue : DataTypes.UUIDV4,
            primaryKey : true
        },
        product_price : {
            type : DataTypes.FLOAT,
            allowNull : false,
        },
        product_quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
        // currency : {
        //     type : DataTypes.STRING(10),
        //     allowNull : false
        // },
        // order_status : {
        //     type : DataTypes.ENUM(['pending','Accepted','On The Way','Delivered','Cancelled','Refunded']),
        //     allowNull : false
        // },
        // payment_status : {
        //     type : DataTypes.ENUM(['Paid','Not Paid','Cash On Delivery']),
        //     allowNull : false
        // }
    },
    {
        sequelize,
        modelName : 'SellerOrder'
    })

    return SellerOrder;
}