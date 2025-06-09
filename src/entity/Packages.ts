import { DataTypes, Model } from "sequelize";
import sequelize from "./Database";

class Packages extends Model {
    public id!: number;
    public title!: string;
    public icon!: string;
    public isPopular!:boolean;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Packages.init(
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
        isPopular:{
            type: DataTypes.BOOLEAN,
            allowNull:false,
            defaultValue: false
        }
    },
    {
        sequelize,
        tableName: "packages"
    }
);

export default Packages;
