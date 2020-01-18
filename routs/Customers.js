const express = require("express");
const { Customer, validate } = require("../Models/Customer");
const auth = require("../Middleware/auth");
const admin = require("../Middleware/admin");
const validateBody = require("../Middleware/validate");
const validateObjectId = require("../Middleware/validateObjectId");
const Router = express.Router();

Router.get("/", async (req, res) => {
  const courses = await Customer.find().sort({ name: 1 });
  res.send(courses);
});

Router.post("/", [auth, validateBody(validate)], async (req, res) => {
  const { name, phone, isGold } = req.body;
  const customer = new Customer({
    name: name,
    phone: phone,
    isGold: isGold
  });
  await customer.save();
  res.send(customer);
});

Router.get("/:id", validateObjectId, async (req, res) => {
  const customer = await Customer.findById(req.params.id);
  if (!customer) return res.status(404).send("Customer not available");

  res.send(customer);
});

Router.put(
  "/:id",
  [auth, validateObjectId, validateBody(validate)],
  async (req, res) => {
    const { id } = req.params;
    const { name, phone, isGold } = req.body;

    const customer = await Customer.findByIdAndUpdate(
      id,
      {
        $set: {
          name: name,
          phone: phone,
          isGold: isGold
        }
      },
      { new: true }
    );
    if (!customer) return res.status(404).send("No such Customer found");

    res.send(customer);
  }
);

Router.delete("/:id", [auth, admin, validateObjectId], async (req, res) => {
  const customer = await Customer.findById(req.params.id);
  if (!customer) return res.status(404).send("No such Customer found");

  const result = await Customer.deleteOne({ _id: req.params.id });
  res.send(result);
});

module.exports = Router;
