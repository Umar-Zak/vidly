const winston = require("winston");
require("winston-mongodb");
require("express-async-errors");
const debug = require("debug")("app:startup");
const express = require("express");
const app = express();
require("./Startup/logging")();
require("./Startup/db")();
require("./Startup/rout")(app);
require("./Startup/config")();
require("./Startup/validation")();
const morgan = require("morgan");

if (app.get("env") == "development") {
  app.use(morgan("tiny"));
  debug("Morgan enabled");
}

const port = process.env.PORT || 3000;
const server = app.listen(port, () =>
  winston.info(`Listening to port ${port}`)
);
debug("Checking");

module.exports = server;

// console.log(`Development ${config.get("name")}`);
// console.log(`Development ${config.get("host")}`);
// console.log(`Development ${config.get("mail.username")}`);

//The line code below did not work in my environment because the property could not be set
//console.log(`Development ${config.get("mail.password")}`)
