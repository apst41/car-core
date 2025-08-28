import { DataTypes, Model } from "sequelize";
import sequelize from "./Database";

class UserAddress extends Model {
    public userId!: string;
    public latitude?: number;
    public longitude?: number;
    public tag?: string;
    public addressText!: string;
    public city!: string;
    public cityId!: number;
    public pincode!: string;
public isSelected?: boolean;
}

UserAddress.init(
    {
        userId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        latitude: {
            type: DataTypes.FLOAT,
            allowNull: true,
        },
        longitude: {
            type: DataTypes.FLOAT,
            allowNull: true,
        },
        tag: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        addressText: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        city: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        pincode: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        cityId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        isSelected: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: false,
        },
    },
    {
        sequelize,
        tableName: "user_address",
        timestamps: true,
    }
);

export default UserAddress;
