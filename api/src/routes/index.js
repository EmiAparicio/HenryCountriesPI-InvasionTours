// Require and instance Router from express
const { Router } = require("express");

const router = Router();

// Require and configure partial routers
const countriesRouter = require("./countries");
const activitiesRoute = require("./activities");

router.use("/countries", countriesRouter);
router.use("/activities", activitiesRoute);

// Export router instance for App to use it as a middleware
module.exports = router;
