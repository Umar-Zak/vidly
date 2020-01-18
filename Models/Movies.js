const mongoose = require("mongoose");
const Joi = require("@hapi/joi");

const genreShema = mongoose.Schema({
  name: { type: String, required: true, minlength: 5, maxlength: 50 }
});

const movieschema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 5,
    trim: true,
    maxlength: 255
  },
  genre: { type: genreShema, required: true },
  numberInStocK: {
    type: Number,
    required: true,
    set: value => parseInt(value),
    trim: true,
    min: 0
  },
  dailyRentalRate: {
    type: Number,
    required: true,
    set: value => parseInt(value),
    trim: true,
    min: 0
  }
});

const Movie = mongoose.model("Movie", movieschema);

function validateMovie(movie) {
  const schema = Joi.object({
    title: Joi.string()
      .min(5)
      .max(50)
      .required(),
    genreId: Joi.objectId().required(),
    numberInStocK: Joi.number()
      .min(0)
      .required(),
    dailyRentalRate: Joi.number()
      .min(0)
      .required()
  });

  return schema.validate(movie);
}

exports.Movie = Movie;
exports.validateMovie = validateMovie;
