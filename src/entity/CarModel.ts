import { DataTypes, Model } from "sequelize";
import sequelize from "./Database";

class CarModel extends Model {
    public id!: number;
    public modelName!: string;
    public modelType!: string;
    public category!: "Regular" | "Economy" | "Premium" | "Luxury";
    public modelImage?: string;
    public manufacturerName!: string;
    public manufacturerId!: number;
}

CarModel.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        modelName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        modelType: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        category: {
            type: DataTypes.ENUM("Regular", "Economy", "Premium", "Luxury"),
            allowNull: false,
        },
        modelImage: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        manufacturerId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        manufacturerName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: "carModel",
        timestamps: true,
    }
);

export default CarModel;
