import { DataTypes, Model } from "sequelize";
import sequelize from "./Database";
class Vehicle extends Model {
    public id!: number;
    public manufacturer!: string;
    public model!: string;
    public type!: string;
}

Vehicle.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        manufacturer: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        model: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: "vehicle",
        timestamps: false,
    }
);

export default Vehicle;