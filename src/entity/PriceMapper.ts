import { DataTypes, Model } from "sequelize";
import sequelize from "./Database";

class PriceMapper extends Model {
    public id!: number;
    public price!: number;
    public name!: string;
    public vehicleId!: number;
}

PriceMapper.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        imageUrl: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: "services",
        timestamps: true,
    }
);

export default PriceMapper;
