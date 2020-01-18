const mongoose = require("mongoose");
const Joi = require("@hapi/joi");

const customerSchema = mongoose.Schema({
  name: { type: String, required: true, minlength: 5, maxlength: 50 },
  isGold: { type: Boolean, required: true },
  phone: { type: String, required: true, minlength: 10, maxlength: 10 }
});

const Customer = mongoose.model("Customer", customerSchema);

function validateCustomer(input) {
  const schema = Joi.object({
    name: Joi.string()
      .min(5)
      .max(50)
      .required(),
    phone: Joi.string()
      .min(10)
      .max(10)
      .required(),
    isGold: Boolean
  });
  return schema.validate(input);
}

exports.Customer = Customer;
exports.validate = validateCustomer;
