const { DataTypes, Model } = require("sequelize");
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.

class Activity extends Model {}

module.exports = (sequelize) => {
  // defino el modelo
  // sequelize.define('Activity', {});

  return Activity.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: "activity",
      },
      difficulty: {
        type: DataTypes.INTEGER,
        unique: "activity",
        validate: {
          min: 1,
          max: 5,
          // inBetween: (value) => {
          //   if (value < 1 || value > 5)
          //     throw new Error("La dificultad debe estar entre 1 y 5");
          // },
        },
      },
      duration: {
        type: DataTypes.INTEGER,
        unique: "activity",
      },
      season: {
        type: DataTypes.ENUM("Verano", "Otoño", "Invierno", "Primavera"),
        unique: "activity",
      },
    },
    { sequelize, modelName: "Activity", timestamps: false }
  );
};
