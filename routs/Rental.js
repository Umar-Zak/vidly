const express = require("express");
const { Rental, validateRental } = require("../Models/Rental");
const { Movie } = require("../Models/Movies");
const { Customer } = require("../Models/Customer");
const mongoose = require("mongoose");
const Fawn = require("fawn");
const auth = require("../Middleware/auth");
const validateBody = require("../Middleware/validate");

Fawn.init(mongoose);

const Rout = express.Router();

Rout.get("/", async (req, res) => {
  const rentals = await Rental.find().sort({ customer: 1 });
  res.send(rentals);
});

Rout.post("/", [auth, validateBody(validateRental)], async (req, res) => {
  const { customerId, movieId } = req.body;

  const movie = await Movie.findById(movieId);
  const customer = await Customer.findById(customerId);

  if (!movie) return res.status(404).send("Movie does not exist");

  if (!customer) return res.status(404).send("Customer does not exist");

  if (movie.numberInStocK === 0)
    return res.status(400).send("Movie out of stock");

  let rental = new Rental({
    customer: {
      _id: customerId,
      name: customer.name,
      phone: customer.phone
    },
    movie: {
      _id: movieId,
      title: movie.title
    },
    dailyRentalRate: movie.dailyRentalRate
  });

  new Fawn.Task()
    .save("rentals", rental)
    .update(
      "movies",
      { _id: movie._id },

      {
        $inc: {
          numberInStocK: -1
        }
      }
    )
    .run();
  res.send(rental);
});

module.exports = Rout;
