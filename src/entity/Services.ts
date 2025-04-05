import { DataTypes, Model } from "sequelize";
import sequelize from "./Database";

class Services extends Model {
    public id!: number;
    public title!: string;
    public icon!: string;
    public isPopular!:boolean;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Services.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        icon: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        isPopular:{
            type: DataTypes.BOOLEAN,
            allowNull:false,
            defaultValue: false
        }
    },
    {
        sequelize,
        tableName: "services"
    }
);

export default Services;
