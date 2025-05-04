import { DataTypes, Model } from "sequelize";
import sequelize from "./Database";

class Booking extends Model {
    public id!: number;
    public userId!: number;
    public status!: string;
    public notes?: string;

    public userVehicleId!: number;
    public addressId!: number;
    public serviceDetailsId!: number;
    public slotId!: number;

    public price!: number;
    public discount!: number;
    public finalAmount!: number;
    public city!: string;
}

Booking.init(
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
        status: {
            type: DataTypes.ENUM("PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"),
            defaultValue: "PENDING",
        },
        notes: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        userVehicleId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        addressId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        serviceDetailsId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        slotId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        price: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        discount: {
            type: DataTypes.FLOAT,
            allowNull: false,
            defaultValue: 0,
        },
        finalAmount: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        city: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: "booking",
        timestamps: true,
    }
);

export default Booking;
