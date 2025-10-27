import { DataTypes, Model } from "sequelize";
import sequelize from "./Database";

class AppVersion extends Model {
    public id!: number;
    public platform!: string; // "android" | "ios"
    public latestVersion!: any; // JSON
    public forceUpdateVersion!: any; // JSON
    public optionalVersion!: any; // JSON
    public updateUrl!: string;
    public status!: "ok" | "optional_update" | "force_update";
    public isActive!: boolean;
}

AppVersion.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        platform: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        latestVersion: {
            type: DataTypes.JSON, // ✅ JSON column
            allowNull: false,
            defaultValue: {
                version: "1.0.0",
                message: "You are on the latest version.",
            },
        },
        optionalVersion: {
            type: DataTypes.JSON, // ✅ JSON column
            allowNull: true,
            defaultValue: {
                version: [],
                message: "A new version is available. Update now for latest features.",
            },
        },
        forceUpdateVersion: {
            type: DataTypes.JSON, // ✅ JSON column
            allowNull: true,
            defaultValue: {
                version: [],
                message: "A new version is available. Please update to continue.",
            },
        },
        updateUrl: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM("ok", "optional_update", "force_update"),
            allowNull: false,
            defaultValue: "ok",
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    },
    {
        sequelize,
        tableName: "app_versions",
        timestamps: true,
        indexes: [
            {
                unique: true,
                fields: ["platform"],
            },
        ],
    }
);

export default AppVersion;
