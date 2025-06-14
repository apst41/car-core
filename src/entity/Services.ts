import { DataTypes, Model } from "sequelize";
import sequelize from "./Database";

class Services extends Model {
    public id!: number;
    public title!: string;
    public thumbnail!: string;
    public image_url!: string;
    public description!: string;
    public price!: number;
    public durationMinutes!: number;
    public videos!: string[];
}

Services.init(
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
        thumbnail: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        image_url: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        price: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        durationMinutes: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        videos: {
            type: DataTypes.JSON,
            allowNull: true,
        },
    },
    {
        sequelize,
        tableName: "services",
        timestamps: true,
    }
);

export default Services;
