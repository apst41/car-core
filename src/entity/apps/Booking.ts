import { DataTypes, Model } from "sequelize";
import sequelize from "./Database";

class Booking extends Model {
    public id!: string;
    public userId!: number;
    public status!: string;
    public notes?: string;

    public userVehicleId!: number;
    public addressId!: number;
    public packageId!: number;
    public slotId!: number;

    // Now JSON instead of number
    public price!: Record<string, any>;
    public discount!: number;
    public city!: string;
}

Booking.init(
    {
        id: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM(
                "PENDING",
                "CONFIRMED",
                "CANCELLED",
                "COMPLETED",
                "RESCHEDULED"
            ),
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
        packageId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        slotId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        // ✅ Store as JSON
        price: {
            type: DataTypes.JSON,
            allowNull: false,
        },
        discount: {
            type: DataTypes.FLOAT,
            allowNull: false,
            defaultValue: 0,
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
