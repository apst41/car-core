// models/PartnerUser.ts

import { DataTypes, Model } from "sequelize";
import sequelize from "../apps/Database";

class PartnerUser extends Model {
    public id!: number;
    public mobileNo!: string;
    public name?: string;
    public username!: string;
    public email!: string;
    public passwordHash!: string;
    public otpCode?: string | null;
    public otpExpiry?: Date | null;
    public isVerified?: boolean;
    public token?: string | null;
    public tokenExpiry?: Date | null;
    public isActive!: boolean;
}

PartnerUser.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        mobileNo: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: { isEmail: true },
        },
        passwordHash: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        otpCode: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        otpExpiry: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        isVerified: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: false,
        },
        token: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null,
        },
        tokenExpiry: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: null,
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
    },
    {
        sequelize,
        tableName: "partner_user",
        timestamps: true,
    }
);

export default PartnerUser;
