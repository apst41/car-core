import { DataTypes, Model } from "sequelize";
import sequelize from "./Database";

class CarModel extends Model {
    public id!: number;
    public modelName!: string;
    public modelType!: string;
    public modelImage?: string;
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
        modelImage: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        manufacturerId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: "car_model",
        timestamps: true,
    }
);

export default CarModel;
