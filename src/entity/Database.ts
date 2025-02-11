import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import Cities from "./Cities";


dotenv.config();

const sequelize = new Sequelize(
    process.env.DB_NAME || "car",
    process.env.DB_USER || "car",
    process.env.DB_PASSWORD || "Oneplus@197",
    {
        host: process.env.DB_HOST || "localhost",
        database:'car',
        port:3306,
        username:'car',
        password:'Oneplus@197',
        dialect: "mysql",
    }
);

(async () => {
    try {
        await sequelize.authenticate();
        console.log("Database connected successfully!");
        await sequelize.sync({ alter: true }); // Sync models
        console.log("Database synchronized successfully!");
    } catch (error) {
        console.error("Failed to connect or synchronize:", error);
    }
})();

export default sequelize;
