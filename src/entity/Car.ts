import { DataTypes, Model } from "sequelize";
import sequelize from "./Database";
class Car extends Model {
    public id!: number;
    public manufacturer!: string;
    public model!: string;
    public type!: string;
}

Car.init(
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
        tableName: "cars",
        timestamps: false,
    }
);

export default Car;