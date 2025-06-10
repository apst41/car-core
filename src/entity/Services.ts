import { DataTypes, Model } from "sequelize";
import sequelize from "./Database";

class Services extends Model {
    public id!: number;
    public serviceId!: string;
    public title!: string;
    public thumbnail!: string;
    public price!: number;
}

Services.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        serviceId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        thumbnail: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        price: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: "services",
        timestamps: true,
    }
);

export default Services;
