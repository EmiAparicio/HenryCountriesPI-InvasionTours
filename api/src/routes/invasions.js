///////////////////////////////////////////////////////////////////////////////
// Requires
///////////////////////////////////////////////////////////////////////////////
const { Router } = require("express");
const { Invasion } = require("../db");

///////////////////////////////////////////////////////////////////////////////
// Routes definition
///////////////////////////////////////////////////////////////////////////////
const router = Router();

// Partial route POST from: localhost:PORT/invasions
router.post("/", async (req, res) => {
  const { name, difficulty, duration, season, countriesId } = req.body;

  // Respond particular error if no name was sent through request body
  if (!name) return res.status(404).send("La invasión debe tener un nombre");

  try {
    // As Invasion model sets a "name" as "Name",
    // query to the db needs to have the same format
    let firstLetter = name.charAt(0).toUpperCase();
    let word = name.slice(1);

    // Try to find or create particular invasion
    const [invasion, created] = await Invasion.findOrCreate({
      where: {
        name: firstLetter + word,
        difficulty,
        duration,
        season,
      },
    });

    // Associate the invasion with the related countries
    const addCountryInvasion = countriesId.map(
      async (id) => await invasion.addCountry(id)
    );
    await Promise.all(addCountryInvasion);

    // Respond with the invasion, created or not
    return res.status(201).json({ invasion, created });
  } catch (e) {
    // Respond with particular error
    return res.status(404).send("Error en los datos o la invasión ya culminó");
  }
});

// Complete route DELETE from: localhost:PORT/invasions
router.delete("/ALL", (req, res) => {
  Invasion.destroy({
    truncate: true,
    cascade: true,
    force: true,
  })
    .then((resp) => {
      return res.status(200).json(resp);
    })
    .catch((e) =>
      res.status(404).send("Error en los datos o la invasión ya culminó")
    );
});

// Partial route DELETE from: localhost:PORT/invasions
router.delete("/NEILA", (req, res) => {
  Invasion.destroy({
    where: {
      name: "NEILA",
    },
    force: true,
  })
    .then((resp) => {
      return res.status(200).json(resp);
    })
    .catch((e) =>
      res.status(404).send("Error en los datos o la invasión ya culminó")
    );
});

// Export router to configure partial middleware at ./index.js
module.exports = router;
