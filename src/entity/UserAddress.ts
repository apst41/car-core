import { DataTypes, Model } from "sequelize";
import sequelize from "./Database";

class UserAddress extends Model {
    public userId!: string;
    public latitude?: number;
    public longitude?: number;
    public tag?: string;
    public addressText!: string;
}

UserAddress.init(
    {
        userId: {
            type: DataTypes.STRING,
            allowNull: false, // Cannot be null
        },
        latitude: {
            type: DataTypes.FLOAT,
            allowNull: true, // Can be null
        },
        longitude: {
            type: DataTypes.FLOAT,
            allowNull: true, // Can be null
        },
        tag: {
            type: DataTypes.STRING,
            allowNull: true, // Can be null
        },
        addressText: {
            type: DataTypes.STRING,
            allowNull: false, // Cannot be null
        },
    },
    {
        sequelize,
        tableName: "user_address",
    }
);

export default UserAddress;
