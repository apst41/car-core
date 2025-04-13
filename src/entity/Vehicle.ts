import { DataTypes, Model } from "sequelize";
import sequelize from "./Database";

class Vehicle extends Model {
    public id!: number;
    public manufacturer!: string;
    public model!: string;
    public type!: string;
    public manufacturerImage?: string; // Optional field for manufacturer image
    public modelImage?: string;
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
        manufacturerImage: {
            type: DataTypes.STRING, // Optional field for the manufacturer's image URL
            allowNull: true, // This allows the field to be null
        },
        modelImage: {
            type: DataTypes.STRING, // Optional field for the model image URL
            allowNull: true, // This allows the field to be null
        },
    },
    {
        sequelize,
        tableName: "vehicle", // This is the name of the table in your database
    }
);

export default Vehicle;
