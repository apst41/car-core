import { DataTypes, Model } from "sequelize";
import sequelize from "./Database";

class PackageDetails extends Model {
    public id!: number;
    public serviceIds!: Set<string>;
    public name!: string;
    public price!: number;
    public discount!: number;
    public durationMinutes!: number;
    public videos!: string[];
    public PackageInclusions!: {
        title: string;
        description: string;
        image_url: string;
    }[];
}

PackageDetails.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        serviceIds: {
            type: DataTypes.JSON, // Stored as an array of strings
            allowNull: false,
            get() {
                const raw = this.getDataValue("serviceIds");
                return new Set(raw);
            },
            set(val: Set<string>) {
                this.setDataValue("serviceIds", Array.from(val));
            },
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
        tableName: "package_details",
        timestamps: true,
    }
);

export default PackageDetails;
