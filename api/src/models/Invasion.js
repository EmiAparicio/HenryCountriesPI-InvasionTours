// Requires
const { DataTypes } = require("sequelize");

// Export function that will define model
// when injected with sequelize db connection
// in ../db.js
module.exports = (sequelize) => {
  sequelize.define("Invasion", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: "invasion",
      set(value) {
        // Set a "name" as "Name"
        let firstLetter = value.charAt(0).toUpperCase();
        let word = value.slice(1);
        this.setDataValue("name", firstLetter + word);
      },
    },
    difficulty: {
      type: DataTypes.INTEGER,
      unique: "invasion",
      validate: {
        min: 1,
        max: 5,
      },
    },
    duration: {
      type: DataTypes.INTEGER,
      unique: "invasion",
    },
    season: {
      type: DataTypes.ENUM("Verano", "Otoño", "Invierno", "Primavera"),
      unique: "invasion",
    },
    usercode: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: "invasion",
    },
  });
};
