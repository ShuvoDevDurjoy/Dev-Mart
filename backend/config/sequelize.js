import Sequelize from 'sequelize';
import dotenv from 'dotenv'

dotenv.config();

const sequelize = new Sequelize(process.env.DATABASE_NAME, process.env.DATABASE_USER, process.env.DATABASE_PASSWORD, {
  host: process.env.DATABASE_HOST,
  dialect: 'mysql', // Change this to your database dialect (e.g., 'mysql', 'sqlite', etc.)
});

const checkSequelizeConnection = async()=>{
    try{
        console.log('host name is : ',process.env.DATABASE_PASSWORD)
        sequelize.authenticate();
        console.log("Database Connected Successfully....");
    }catch(e){
        console.log("Database is not connected",e);
    }
}

    

export default checkSequelizeConnection;