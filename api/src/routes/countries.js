const { Router } = require("express");
const { Country } = require("../db");
const router = Router();

let storedData = false;

function validateStoredData(req, res, next) {
  if (!storedData) {
    fetch("https://restcountries.com/v3/all")
      .then((response) => response.json())
      .then((json) => {
        const countriesDB = json.map((c) => {
          return {
            id: c.fifa,
            name: c.name.common,
            flag: c.flags[0],
            continent: c.continents,
            capital: c.capital,
            subregion: c.subregion,
            area: c.area,
            population: c.population,
          };
        });
        Country.bulkCreate(countriesDB).then(() => {
          storedData = true;
          next();
        });
      });
  } else next();
}

router.get("/", validateStoredData, async (req, res) => {
  const { name } = req.query;

  try {
    const countries = await Country.findAll({
      where: name
        ? {
            name: { [Op.like]: `%${name}%` },
          }
        : undefined,
    });

    return res.status(200).json(countries.toJSON());
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

  Country.findByPk(id,
    { include: Activity })
  .then((country) => {
      return res.status(200).json(country.toJSON());
    })
  .catch((e) => {
    return res.status(404).send(`No se encontró un país con ID ${id}`);
  });
});

router.post("/", async (req, res)=>{
  const {name, difficulty, duration, season} = req.body;

  if (!name) return res.status(404).send("La actividad debe tener un nombre")

  try {
    
  } catch (e) {
    
  }
})

module.exports = router;
