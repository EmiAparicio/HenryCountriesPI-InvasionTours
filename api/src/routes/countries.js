////////////////////////////////////////////////////////////////////////////
// Requires
////////////////////////////////////////////////////////////////////////////
const { Router } = require("express");
const { Country, Activity } = require("../db");
const { Op } = require("sequelize");
const fetch = require("node-fetch");

////////////////////////////////////////////////////////////////////////////
// Routes definition
////////////////////////////////////////////////////////////////////////////
const router = Router();

// Validation middleware
function validateStoredData(req, res, next) {
  // Is database filled with Countries? Search known country by pk: "ARG"
  Country.findByPk("ARG").then((storedData) => {
    if (!storedData) {
      // If not, fetch external API and create Countries table in db
      fetch("https://restcountries.com/v3/all")
        .then((response) => response.json())
        .then((response) => {
          const countriesDB = response.map((c) => {
            return {
              id: c.cca3,
              name: c.name.common,
              flag: c.flags[0],
              continent: c.continents[0],
              capital: c.capital ? c.capital[0] : "No tiene",
              subregion: c.subregion,
              area: c.area,
              population: c.population,
            };
          });
          Country.bulkCreate(countriesDB).then(() => {
            next();
          });
        });
    } else next();
  });
}

// Partial route GET from: localhost:PORT/countries/
router.get("/", validateStoredData, async (req, res) => {
  const { name } = req.query; // Possible query included

  try {
    // Try to obtain countries with activities from db
    const countries = await Country.findAll({
      where: name
        ? // Possible filter: country name including string ${name}
          {
            name: { [Op.iLike]: `%${name}%` },
          }
        : undefined,
      include: Activity,
      attributes: ["name", "flag", "continent", "population", "id"],
    });

    // Respond with found countries
    return res.status(200).json(countries);
  } catch (e) {
    // Respond with appropriate error according to search case
    return res
      .status(404)
      .send(
        name
          ? `No hubo resultados para "${name}"`
          : "No se encontraron resultados"
      );
  }
});

// Partial route GET from: localhost:PORT/countries/:id
router.get("/:id", validateStoredData, (req, res) => {
  const { id } = req.params;

  // Try to obtain single country with activities from db
  Country.findByPk(id, { include: Activity })
    .then((country) => {
      // Respond with found country
      return res.status(200).json(country);
    })
    .catch((e) => {
      // Respond with particular error
      return res.status(404).send(`No se encontró un país con ID: "${id}"`);
    });
});

// Export router to configure partial middlewares at ./index.js
module.exports = router;
