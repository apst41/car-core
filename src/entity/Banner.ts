import { DataTypes, Model } from "sequelize";
import sequelize from "./Database";

class Banner extends Model {
    public id!: number;
    public imageUrl!: string;
    public action!: string;
    public type!: string;
    public ctaText!: string;
}

Banner.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        imageUrl: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        action: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        ctaText: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: "banners",
        timestamps: true,
    }
);

export default Banner;
