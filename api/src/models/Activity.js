const { DataTypes } = require("sequelize");
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.

module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define("Activity", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: "activity",
      set(value) {
        let firstLetter = value.charAt(0).toUpperCase();
        let word = value.slice(1).toLowerCase();
        this.setDataValue("name", firstLetter + word);
      },
    },
    difficulty: {
      type: DataTypes.INTEGER,
      unique: "activity",
      validate: {
        min: 1,
        max: 5,
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
  });
};
