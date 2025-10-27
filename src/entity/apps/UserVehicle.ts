import { DataTypes, Model } from "sequelize";
import sequelize from "./Database";

class UserVehicle extends Model {
    public id!: number;
    public userId!: number;
    public carModelId!: number;
    public manufacturerId!:number;
    public isSelected!: boolean;
}

UserVehicle.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        manufacturerId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        carModelId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        isSelected: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
    },
    {
        sequelize,
        tableName: "user_vehicles",
        timestamps: true,
    }
);

export default UserVehicle;
