import { DataTypes, Model } from "sequelize";
import sequelize from "./Database";

class ServiceDetails extends Model {
    public id!: number;
    public serviceId!: string;
    public name!: string;
    public price!: number;
    public discount!: number;
    public durationMinutes!: number;
    public videos!: string[];
    public serviceInclusions!: {
        title: string;
        description: string;
        image_url: string;
    }[];
}

ServiceDetails.init(
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
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        price: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        discountedPrice: {
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
        serviceInclusions: {
            type: DataTypes.JSON, // array of objects
            allowNull: true,
        },
    },
    {
        sequelize,
        tableName: "service_details",
    }
);

export default ServiceDetails;
