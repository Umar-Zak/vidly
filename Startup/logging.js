const winston = require("winston");

module.exports = function() {
  winston.add(winston.transports.File, { filename: "logfile.log" });

  winston.handleExceptions(
    new winston.transports.File({ filename: "unhandledException.log" })
  );

  process.on("unhandledRejection", ex => {
    throw ex;
  });
};
