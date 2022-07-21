const { Router } = require("express");
const { Activity } = require("../db");
const router = Router();

router.post("/", async (req, res) => {
  const { name, difficulty, duration, season, countriesId } = req.body;

  if (!name) return res.status(404).send("La actividad debe tener un nombre");

  try {
    let firstLetter = name.charAt(0).toUpperCase();
    let word = name.slice(1).toLowerCase();
    const [activity, created] = await Activity.findOrCreate({
      where: {
        name: firstLetter + word,
        difficulty,
        duration,
        season,
      },
    });

    const addCountryActivity = countriesId.map(
      async (id) => await activity.addCountry(id)
    );
    await Promise.all(addCountryActivity);

    return res.status(201).json({ activity, created });
  } catch (e) {
    return res.status(404).send(e); //"Error en los datos o la actividad ya existe");
  }
});

module.exports = router;
