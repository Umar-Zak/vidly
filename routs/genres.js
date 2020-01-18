const express = require("express");
const Joi = require("@hapi/joi");
const mongoose = require("mongoose");
const router = express.Router();
const auth = require("../Middleware/auth");
const admin = require("../Middleware/admin");
const validateObjectId = require("../Middleware/validateObjectId");
const validateBody = require("../Middleware/validate");

const genreSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 50
  }
});

const Genre = mongoose.model("Genre", genreSchema);

router.get("/", async (req, res) => {
  const genres = await Genre.find();
  res.send(genres);
});

router.get("/:id", validateObjectId, async (req, res) => {
  const genre = await Genre.findById(req.params.id);
  if (!genre) return res.status(404).send("Genre Not Available");

  res.send(genre);
});

router.post("/", [auth, validateBody(validateGenres)], async (req, res) => {
  const genre = new Genre({
    name: req.body.name
  });

  await genre.save();
  res.send(genre);
});

router.put(
  "/:id",
  [auth, validateObjectId, validateBody(validateGenres)],
  async (req, res) => {
    const { id } = req.params;

    const genre = await Genre.findByIdAndUpdate(
      id,
      {
        $set: {
          name: req.body.name
        }
      },
      { new: true }
    );
    if (!genre) return res.status(404).send("Genre Not Available");

    res.send(genre);
  }
);

router.delete("/:id", [auth, admin, validateUpdate], async (req, res) => {
  const genre = await Genre.findById(req.params.id);
  if (!genre) return res.status(404).send("Genre Not Available");

  const result = await Genre.deleteMany({ _id: req.params.id });
  res.send(result);
});

function validateGenres(input) {
  const schema = Joi.object({
    name: Joi.string()
      .min(5)
      .max(50)
      .required()
  });

  return schema.validate(input);
}

function validateUpdate(input) {
  const schema = Joi.object({
    name: Joi.string()
      .min(5)
      .max(50)
      .required()
  });
  return schema.validate(input);
}

module.exports.Router = router;
module.exports.Genre = Genre;
