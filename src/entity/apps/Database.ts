import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(
    process.env.DB_NAME || "car",
    process.env.DB_USER || "car",
    process.env.DB_PASSWORD || "Oneplus@197",
    {
        host: process.env.DB_HOST || "localhost",
        port: 3306,
        dialect: "mysql",
        logging: false, // optional: remove SQL logs
    }
);

(async () => {
    try {
        await sequelize.authenticate();
        console.log("✅ Database connected successfully!");

        // Only create tables if they don't exist
        // This will NOT try to re-add indexes every time
        await sequelize.sync();
        console.log("✅ Models synced successfully!");
    } catch (error) {
        console.error("❌ Failed to connect or sync models:", error);
    }
})();

export default sequelize;
