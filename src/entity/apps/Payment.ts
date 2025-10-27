import { DataTypes, Model } from "sequelize";
import sequelize from "./Database";

class Payment extends Model {
    public id!: string;
    public merchantOrderId!: string;
    public phonePeOrderId?: string;
    public userId!: number;
    public bookingId?: string;
    
    public amount!: number;
    public currency!: string;
    public status!: string;
    
    public paymentMode?: string;
    public transactionId?: string;
    public phonePeTransactionId?: string;
    
    public redirectUrl?: string;
    public callbackUrl?: string;
    public expireAt?: Date;
    
    public metaInfo?: {
        udf1?: string;
        udf2?: string;
        udf3?: string;
        udf4?: string;
        udf5?: string;
    };
    
    public paymentDetails?: any;
    public errorMessage?: string;
    
    public createdAt!: Date;
    public updatedAt!: Date;
}

Payment.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        merchantOrderId: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        phonePeOrderId: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        bookingId: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        amount: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        currency: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "INR",
        },
        status: {
            type: DataTypes.ENUM(
                "PENDING", 
                "INITIATED", 
                "SUCCESS", 
                "FAILED", 
                "CANCELLED", 
                "EXPIRED", 
                "COMPLETED"
            ),
            defaultValue: "PENDING",
        },
        paymentMode: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        transactionId: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        phonePeTransactionId: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        redirectUrl: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        callbackUrl: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        expireAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        metaInfo: {
            type: DataTypes.JSON,
            allowNull: true,
        },
        paymentDetails: {
            type: DataTypes.JSON,
            allowNull: true,
        },
        errorMessage: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    },
    {
        sequelize,
        tableName: "payment",
        timestamps: true,
        indexes: [
            {
                fields: ["merchantOrderId"],
                unique: true,
            },
            {
                fields: ["userId"],
            },
            {
                fields: ["bookingId"],
            },
            {
                fields: ["status"],
            },
            {
                fields: ["phonePeOrderId"],
            },
        ],
    }
);

export default Payment;
