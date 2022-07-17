const { Router } = require("express");
const { Activity } = require("../db");
const router = Router();

router.post("/", async (req, res) => {
  const { name, difficulty, duration, season } = req.body;

  if (!name) return res.status(404).send("La actividad debe tener un nombre");

  try {
    const activity = await Activity.create({
      name,
      difficulty,
      duration,
      season,
    });

    return res.status(201).json(activity);
  } catch (e) {
    return res.status(404).send("Error en los datos o la actividad ya existe");
  }
});

module.exports = router;
