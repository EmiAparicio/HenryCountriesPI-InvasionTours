/////////////////////////////////////////////////////////////////////////////////////////////////////
// Requires
/////////////////////////////////////////////////////////////////////////////////////////////////////
require("dotenv").config();
const { Sequelize } = require("sequelize");
const fs = require("fs");
const path = require("path");

/////////////////////////////////////////////////////////////////////////////////////////////////////
// Database params from .env
/////////////////////////////////////////////////////////////////////////////////////////////////////
const { DB_USER, DB_PASSWORD, DB_HOST } = process.env;

/////////////////////////////////////////////////////////////////////////////////////////////////////
// Sequelize instance - Connection to postgres database
/////////////////////////////////////////////////////////////////////////////////////////////////////
const sequelize = new Sequelize(
  `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/countries`,
  {
    logging: false, // set to console.log to see the raw SQL queries
    native: false, // lets Sequelize know we can use pg-native for ~30% more speed
  }
);

/////////////////////////////////////////////////////////////////////////////////////////////////////
// Preparing sequelize.models
/////////////////////////////////////////////////////////////////////////////////////////////////////
const basename = path.basename(__filename);
///// basename = db.js         __filename = E:\...\api\src\db.js

const modelsFolder = path.join(__dirname, "/models"); // models = E:\...\src\models
////////////////////////////// __dirname = E:\...\src ----------->^^^^^^^^^^^

// Read files from models folder - Require and create modelDefiners array
const modelDefiners = [];
const modelsNamesArray = fs.readdirSync(modelsFolder);

modelsNamesArray
  .filter(
    (file) =>
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
  )
  .forEach((modelName) => {
    modelDefiners.push(require(path.join(__dirname, "/models", modelName)));
  });

// Inject the connection (sequelize) to all models
modelDefiners.forEach((model) => model(sequelize));

// Capitalize models names ie: country => Country
let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [
  entry[0][0].toUpperCase() + entry[0].slice(1),
  entry[1],
]);
sequelize.models = Object.fromEntries(capsEntries);

/////////////////////////////////////////////////////////////////////////////////////////////////////
// Create models associations
/////////////////////////////////////////////////////////////////////////////////////////////////////
// Destructure models from sequelize "models" property
const { Country, Activity } = sequelize.models;

// Models associations
Country.belongsToMany(Activity, { through: "Country_Activity" });
Activity.belongsToMany(Country, { through: "Country_Activity" });

/////////////////////////////////////////////////////////////////////////////////////////////////////
// Exports
/////////////////////////////////////////////////////////////////////////////////////////////////////
module.exports = {
  ...sequelize.models, // Import models in routes: const { Country, Activity } = require('../db.js');
  conn: sequelize, // Import connection in api/index.js: { conn } = require('./src/db.js');
};
