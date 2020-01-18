const express = require("express");
const { Genre } = require("./genres");
const auth = require("../Middleware/auth");
const admin = require("../Middleware/admin");
const validateBody = require("../Middleware/validate");
const validateObjectId = require("../Middleware/validateObjectId");
const { Movie, validateMovie } = require("../Models/Movies");

const Router = express.Router();

Router.get("/", async (req, res) => {
  const movies = await Movie.find().sort({ title: 1 });
  res.send(movies);
});

Router.get("/:id", validateObjectId, async (req, res) => {
  const movie = await Movie.findById(req.params.id);
  if (!movie) return res.status(404).send("No such Movie found");

  res.send(movie);
});

Router.post("/", [auth, validateBody(validateMovie)], async (req, res) => {
  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(404).send("No such genre");
  const movie = new Movie({
    title: req.body.title,
    genre: {
      _id: req.body.genreId,
      name: genre.name
    },
    numberInStocK: req.body.numberInStocK,
    dailyRentalRate: req.body.dailyRentalRate
  });

  res.send(await movie.save());
});

Router.put(
  "/:id",
  [auth, validateObjectId, validateBody(validateMovie)],
  async (req, res) => {
    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(404).send("No such genre");
    const movie = await Movie.updateOne(
      { _id: req.params.id },
      {
        $set: {
          title: req.body.title,
          genre: {
            _id: req.body.genreId,
            name: genre.name
          },
          numberInStock: req.body.numberInStock,
          dailyRentalRate: req.body.dailyRentalRate
        }
      },
      { new: true }
    );
    res.send(movie);
  }
);

Router.delete("/:id", [auth, admin, validateObjectId], async (req, res) => {
  const result = await Movie.deleteOne({ _id: req.params.id });
  res.send(result);
});

module.exports = Router;
