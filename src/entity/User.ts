import { DataTypes, Model } from "sequelize";
import sequelize from "./Database";

class User extends Model {
    public id!: number;
    public mobileNo!: string;
    public name?: string;
    public username?: string;
    public email?: string;
    public passwordHash?: string;
    public otpCode?: string | null;
    public otpExpiry?: Date | null;
    public isVerified?: boolean;
    public token?: string | null; // Token field
    public tokenExpiry?: Date | null; // Token expiry field
}

User.init(
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
            unique: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true,
            validate: { isEmail: true },
        },
        passwordHash: {
            type: DataTypes.STRING,
            allowNull: true,
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
            type: DataTypes.STRING, // Token field
            allowNull: true,       // Allow null values
            defaultValue: null,    // Default value is null
        },
        tokenExpiry: {
            type: DataTypes.DATE,  // Token expiry field
            allowNull: true,       // Allow null values
            defaultValue: null,    // Default value is null
        },
    },
    {
        sequelize,
        tableName: "users",
    }
);

export default User;