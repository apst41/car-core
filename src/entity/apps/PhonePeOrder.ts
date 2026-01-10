import { DataTypes, Model } from "sequelize";
import sequelize from "./Database";

class PhonePeOrder extends Model {
    public id!: number;

    public merchantOrderId!: string;
    public orderId!: string | null;

    public amount!: number;
    public expireAfter!: number;

    public state!: string;

    public redirectUrl!: string | null;
}

PhonePeOrder.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },

        merchantOrderId: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },

        orderId: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        amount: {
            type: DataTypes.INTEGER, // paise
            allowNull: false,
        },

        expireAfter: {
            type: DataTypes.BIGINT, // seconds
            allowNull: false,
        },

        state: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "CREATED",
        },

        redirectUrl: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    },
    {
        sequelize,
        tableName: "phonepe_order",
        timestamps: true,
        indexes: [
            {
                unique: true,
                fields: ["merchantOrderId"],
            },
        ],
    }
);

export default PhonePeOrder;
