import { DataTypes, Model } from "sequelize";
import sequelize from "./Database";

class User extends Model {
    public id!: number;
    public name!: string;
    public username!: string;
    public email!: string;
    public passwordHash!: string;
    public otpCode?: string | null;
    public otpExpiry?: Date | null;
    public isVerified!: boolean;
}

User.init(
    {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
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
            defaultValue: false,
        },
    },
    {
        sequelize,
        tableName: "users",
    }
);

export default User;
