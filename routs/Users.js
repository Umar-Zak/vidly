const express = require("express");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const auth = require("../Middleware/auth");
const validateBody = require("../Middleware/validate");
const { User, validateUsers } = require("../Models/Users");
const Router = express.Router();

Router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.send(user);
});

Router.post("/", validateBody(validateUsers), async (req, res) => {
  const { name, email, password } = req.body;
  let user = await User.findOne({ email: email });
  if (user) return res.status(400).send("User already registered");

  user = new User({
    name,
    email,
    password
  });
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();
  const token = user.genAuthToken();
  res
    .header("x-auth-token", token)
    .send(_.pick(user, ["_id", "name", "email"]));
    
});

module.exports = Router;
