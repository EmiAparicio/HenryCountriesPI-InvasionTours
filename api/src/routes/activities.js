///////////////////////////////////////////////////////////////////////////////
// Requires
///////////////////////////////////////////////////////////////////////////////
const { Router } = require("express");
const { Activity } = require("../db");

///////////////////////////////////////////////////////////////////////////////
// Routes definition
///////////////////////////////////////////////////////////////////////////////
const router = Router();

// Partial route POST from: localhost:PORT/activities
router.post("/", async (req, res) => {
  const { name, difficulty, duration, season, countriesId } = req.body;

  // Respond particular error if no name was sent through request body
  if (!name || !difficulty || !duration || !season || !countriesId)
    return res.status(404).send("Error en los datos o la actividad ya existe");

  try {
    // As Activity model sets a "name" as "Name",
    // query to the db needs to have the same format
    let firstLetter = name.charAt(0).toUpperCase();
    let word = name.slice(1).toLowerCase();

    // Try to find or create particular activity
    const [activity, created] = await Activity.findOrCreate({
      where: {
        name: firstLetter + word,
        difficulty,
        duration,
        season,
      },
    });

    // Associate the activity with the related countries
    const addCountryActivity = countriesId.map(
      async (id) => await activity.addCountry(id)
    );
    await Promise.all(addCountryActivity);

    // Respond with the activity, created or not
    return res.status(201).json({ activity, created });
  } catch (e) {
    // Respond with particular error
    return res.status(404).send("Error en los datos o la actividad ya existe");
  }
});

// Export router to configure partial middleware at ./index.js
module.exports = router;
