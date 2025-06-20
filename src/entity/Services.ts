import { DataTypes, Model } from "sequelize";
import sequelize from "./Database";

class Services extends Model {
    public id!: number;
    public title!: string;
    public oneLiner!:String;
    public imageUrl!: string;
    public description!: string;
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
        imageUrl: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        oneLiner: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: "services",
        timestamps: true,
    }
);

export default Services;
