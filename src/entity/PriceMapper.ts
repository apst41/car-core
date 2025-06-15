import { DataTypes, Model } from "sequelize";
import sequelize from "./Database";

class PriceMapper extends Model {
    public id!: number;
    public name!: string;
    public price!: number;       // Stored as integer
    public modelId!: number;
}

PriceMapper.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        price: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        modelId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: "price_mapper",
        timestamps: true,
    }
);

export default PriceMapper;
