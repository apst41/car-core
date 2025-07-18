import { DataTypes, Model } from "sequelize";
import sequelize from "./Database";

class Feedback extends Model {
    public id!: number;
    public userId!: number;
    public bookingId!: number;
    public rating!: number;
    public comment?: string;
}

Feedback.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        rating: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1,
                max: 5,
            },
        },
        bookingId:{
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        comment: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    },
    {
        sequelize,
        tableName: "feedback",
        timestamps: true, // adds createdAt and updatedAt
    }
);

export default Feedback;
