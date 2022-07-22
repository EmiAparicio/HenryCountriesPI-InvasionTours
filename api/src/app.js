//////////////////////////////////////////////////////////////////////////////
// Requires
//////////////////////////////////////////////////////////////////////////////
const express = require("express");
const routes = require("./routes/index.js");

require("./db.js");

//////////////////////////////////////////////////////////////////////////////
// Server instance with express
//////////////////////////////////////////////////////////////////////////////
const server = express();

server.name = "API";

// Middlewares
server.use(express.urlencoded({ extended: true, limit: "50mb" }));
server.use(express.json({ limit: "50mb" }));

server.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); //'http://localhost:3000');
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});

server.use("/", routes);

// Error catching endware
server.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || err;
  console.error(err);
  res.status(status).send(message);
});

//////////////////////////////////////////////////////////////////////////////
// Exports
//////////////////////////////////////////////////////////////////////////////
module.exports = server;
