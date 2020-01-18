const config = require("config");

module.exports = function() {
  if (!config.get("privatekey")) {
    throw new Error(
      "Fatal error: No enviromental variable set for private key"
    );
  }
};
