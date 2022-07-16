const { Router } = require("express");
const { Op, Country, Activity } = require("../db");
const axios = require("axios");
const router = Router();



function validateStoredData(req, res, next) {
  try {
    let storedData = Country.findByPk("ARG");
  } catch (e) {
    
  }
  if (!storedData) {
    axios("https://restcountries.com/v3/all").then((res) => {
      const countriesDB = res.data.map((c) => {
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
        storedData = true;
        console.log("STOOOOOOOOOOOOOOOOOOORED");
        next();
      });
    });
  } else next();
}

router.get("/", validateStoredData, async (req, res) => {
  const { name } = req.query;
  let countries;

  try {
    if (name) {
      countries = await Country.findAll({
        where: {
          name: { [Op.like]: `%${name}%` },
        },
      });
    } else {
      countries = await Country.findAll();
    }
    // const countries = await Country.findAll({
    //         where: name
    //           ? {
    //               name: { [Op.like]: `%${name}%` },
    //             }
    //           : null,
    //       }
    // );

    return res.status(200).json(countries.toJSON());
  } catch (e) {
    return res.status(404).send(
      name ? `No hubo resultados para "${name}"` : e //"No se encontraron resultados"
    );
  }
});

router.get("/:id", (req, res) => {
  const { id } = req.params;

  Country.findByPk(id, { include: Activity })
    .then((country) => {
      return res.status(200).json(country.toJSON());
    })
    .catch((e) => {
      return res.status(404).send(`No se encontró un país con ID ${id}`);
    });
});

module.exports = router;
