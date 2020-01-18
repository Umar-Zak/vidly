const express = require("express");
const Joi = require("@hapi/joi");
const router = express.Router();
const auth = require("../Middleware/auth");
const validateBody = require("../Middleware/validate");
const { Rental } = require("../Models/Rental");
const { Movie } = require("../Models/Movies");

router.post("/", [auth, validateBody(validateReturn)], async (req, res) => {
  const { customerId, movieId } = req.body;
  const rental = await Rental.lookup(customerId, movieId);
  if (!rental) return res.status(404).send("Rental unavailable");

  if (rental.dateReturned) return res.status(400).send("Rental returned");

  rental.return();
  await rental.save();

  await Movie.update(
    { _id: movieId },
    {
      $inc: {
        numberInStocK: 1
      }
    }
  );

  res.send(rental);
});

function validateReturn(body) {
  const schema = Joi.object({
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required()
  });

  return schema.validate(body);
}

module.exports = router;
