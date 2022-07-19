const { Router } = require("express");
const { Country, Activity } = require("../db");
const { Op } = require("sequelize");
const fetch = require("node-fetch");
const router = Router();

function validateStoredData(req, res, next) {
  Country.findByPk("ARG").then((storedData) => {
    if (!storedData) {
      fetch("https://restcountries.com/v3/all")
        .then((res) => res.json())
        .then((res) => {
          const countriesDB = res.map((c) => {
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

router.get("/", validateStoredData, async (req, res) => {
  const { name } = req.query;

  try {
    const countries = await Country.findAll({
      where: name
        ? {
            name: { [Op.iLike]: `%${name}%` },
          }
        : undefined,
      include: Activity,
      attributes: ["name", "flag", "continent", "population"],
    });

    return res.status(200).json(countries);
  } catch (e) {
    return res
      .status(404)
      .send(
        name
          ? `No hubo resultados para "${name}"`
          : "No se encontraron resultados"
      );
  }
});

router.get("/:id", (req, res) => {
  const { id } = req.params;

  Country.findByPk(id, { include: Activity })
    .then((country) => {
      return res.status(200).json(country);
    })
    .catch((e) => {
      return res.status(404).send(`No se encontró un país con ID: "${id}"`);
    });
});

module.exports = router;
