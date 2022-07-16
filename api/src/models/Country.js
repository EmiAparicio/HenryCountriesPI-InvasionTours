const { DataTypes, Model } = require("sequelize");
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.

class Country extends Model {}

module.exports = (sequelize) => {
  // defino el modelo
  // sequelize.define('Country', {});

  return Country.init(
    {
      id: {
        type: DataTypes.STRING(3),
        primaryKey: true,
        validate: {
          onlyLetters: (value) => {
            if (!/^[A-Z]+$/.test(value))
              throw new Error("El ID del país debe contener solo letras");
          },
        },
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      flag: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      continent: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      capital: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      subregion: {
        type: DataTypes.STRING,
      },
      area: {
        type: DataTypes.INTEGER,
      },
      population: {
        type: DataTypes.INTEGER,
      },
    },
    { sequelize, modelName: "Country", timestamps: false }
  );
};
