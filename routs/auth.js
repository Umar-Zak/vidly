const express = require("express");
const bcrypt = require("bcrypt");
const Joi = require("@hapi/joi");
const validateBody = require("../Middleware/validate");
const { User } = require("../Models/Users");

const Router = express.Router();

Router.post("/", validateBody(validate), async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Incorrect email or password");

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword)
    return res.status(400).send("Incorrect email or password");

  const token = user.genAuthToken();
  res.send(token);
});

function validate(input) {
  const schema = Joi.object({
    email: Joi.string()
      .required()
      .email(),
    password: Joi.string().required()
  });

  return schema.validate(input);
}

module.exports = Router;
