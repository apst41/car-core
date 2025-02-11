import { DataTypes, Model } from "sequelize";
import sequelize from "./Database";

class Cities extends Model {
    public id!: number;
    public name!: string;
    public imageUrl?: string;
}

Cities.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        imageUrl: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        sequelize,
        tableName: "cities"
    }
);

export default Cities;
