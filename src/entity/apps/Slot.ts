import { DataTypes, Model } from "sequelize";
import sequelize from "./Database";

class Slot extends Model {
    public id!: number;
    public date!: string;
    public time!: string;
    public slotCount!: number;
}

Slot.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        time: {
            type: DataTypes.TIME,
            allowNull: false,
        },
        slotCount: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
    },
    {
        sequelize,
        tableName: "slots",
        timestamps: true,
    }
);

export default Slot;
