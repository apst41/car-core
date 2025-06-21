import { DataTypes, Model } from "sequelize";
import sequelize from "./Database";

class Packages extends Model {
    public id!: number;
    public serviceIds!: { id: number; order: number }[];
    public icon!: string;
    public isPopular!: boolean;
    public oneLiner!: string;
    public name!: string;
    public price!: number;
    public discount!: number;
    public durationMinutes!: number;
    public videos?: string;
    public title!: string;
    public description!: string;
    public isActive?: boolean;
}

Packages.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        serviceIds: {
            type: DataTypes.JSON,
            allowNull: false,
            get() {
                const raw = this.getDataValue("serviceIds");
                return Array.isArray(raw) ? raw : Object.values(raw); // always return as array
            },
            set(val: { id: number; order: number }[]) {
                this.setDataValue("serviceIds", val);
            },
        },
        icon: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        isPopular: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        oneLiner: {
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
        discount: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        durationMinutes: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        videos: {
            type: DataTypes.STRING,
            allowNull: true, // ✅ allows null in DB
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: true,
        },
    },
    {
        sequelize,
        tableName: "packages",
        timestamps: true,
    }
);

export default Packages;
