import { DataTypes, Model } from "sequelize";
import sequelize from "./Database";

class PriceMapper extends Model {
    public id!: number;
    public packageId!: string;
    public carModelId!: number;
    public price!: number;
    public cityId!: number;
}

PriceMapper.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        packageId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        carModelId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        price: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        cityId:{
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    },
    {
        sequelize,
        tableName: "price_mapper",
        timestamps: true,
    }
);

export default PriceMapper;
