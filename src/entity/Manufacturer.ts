import { DataTypes, Model } from "sequelize";
import sequelize from "./Database";

class Manufacturer extends Model {
    public id!: number;
    public manufacturer!: string;
    public manufacturerImage?: string;
}

Manufacturer.init(
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
        manufacturerImage: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        sequelize,
        tableName: "manufacturer",
        timestamps: true,
    }
);

export default Manufacturer;
