const express = require("express");
const helmet = require("helmet");
const { Router: genres } = require("../routs/genres");
const customers = require("../routs/Customers");
const movies = require("../routs/Movies");
const rentals = require("../routs/Rental");
const users = require("../routs/Users");
const auth = require("../routs/auth");
const returns = require("../routs/returns");
const error = require("../Middleware/error");

module.exports = function(app) {
  app.use(helmet());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use("/api/customers", customers);
  app.use("/api/movies", movies);
  app.use("/api/rentals", rentals);
  app.use("/api/users", users);
  app.use("/api/auth", auth);
  app.use("/api/genres", genres);
  app.use("/api/returns", returns);
  app.use("/public", express.static("./Assets"));

  app.use(error);
};
