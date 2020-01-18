const mongoose = require("mongoose");
const Joi = require("@hapi/joi");
const jwt = require("jsonwebtoken");
const config = require("config");

const userSchema = mongoose.Schema({
  name: { type: String, required: true, minlength: 5, maxlength: 50 },
  email: {
    type: String,
    unique: true,
    required: true,
    minlength: 5,
    maxlength: 255
  },
  password: { type: String, required: true, minlength: 8, maxlength: 1124 },
  isAdmin: Boolean
});

userSchema.methods.genAuthToken = function() {
  return jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin },
    config.get("privatekey")
  );
};

const User = mongoose.model("User", userSchema);

function validateUsers(input) {
  const schema = Joi.object({
    name: Joi.string()
      .min(5)
      .max(50)
      .required(),
    email: Joi.string()
      .required()
      .email(),
    password: Joi.string()
      .min(8)
      .max(20)
      .required()
  });

  return schema.validate(input);
}

exports.User = User;
exports.validateUsers = validateUsers;
