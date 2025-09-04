import { DataTypes, Model } from "sequelize";
import sequelize from "./Database";

class AppVersion extends Model {
    public id!: number;
    public platform!: string; // "android" | "ios"
    public appVersion!: string; // version for querying (e.g., "2.3")
    public latestVersion!: string;
    public minSupportedVersion!: string;
    public updateUrl!: string;
    public forceUpdateMessage!: string;
    public optionalUpdateMessage!: string;
    public status!: string; // "ok", "optional_update", "force_update"
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
        appVersion: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        latestVersion: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        minSupportedVersion: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        updateUrl: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        forceUpdateMessage: {
            type: DataTypes.TEXT,
            allowNull: false,
            defaultValue: "A new version is available. Please update to continue.",
        },
        optionalUpdateMessage: {
            type: DataTypes.TEXT,
            allowNull: false,
            defaultValue: "A new version is available. Update now for the latest features.",
        },
        status: {
            type: DataTypes.ENUM("ok", "optional_update", "force_update"),
            allowNull: false,
            defaultValue: "force_update",
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
                fields: ['platform', 'appVersion']
            }
        ]
    }
);

export default AppVersion;