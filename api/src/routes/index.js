// Require and instance Router from express
const { Router } = require("express");

const router = Router();

// Require and configure partial routers
const countriesRouter = require("./countries");
const activitiesRoute = require("./activities");
const invasionsRoute = require("./invasions");

router.use("/countries", countriesRouter);
router.use("/activities", activitiesRoute);
router.use("/invasions", invasionsRoute);

// Export router instance for App to use it as a middleware
module.exports = router;
