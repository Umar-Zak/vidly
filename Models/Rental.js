const mongoose = require("mongoose");
const Joi = require("@hapi/joi");
const moment = require("moment");

const rentalSchema = mongoose.Schema({
  customer: {
    type: mongoose.Schema({
      name: { type: String, required: true, minlength: 5 },
      phone: { type: String, required: true, minlength: 10 }
    }),
    required: true
  },
  movie: {
    type: mongoose.Schema({
      title: { type: String, required: true },
      dailyRentalRate: { type: Number }
    }),
    required: true
  },
  dateOut: {
    type: Date,
    default: Date.now()
  },
  dateReturned: { type: Date },
  rentalFee: { type: Number }
});

rentalSchema.statics.lookup = function(customerId, movieId) {
  return this.findOne({
    "customer._id": customerId,
    "movie._id": movieId
  });
};

rentalSchema.methods.return = function() {
  this.dateReturned = Date.now();
  const rentalDays = moment().diff(this.dateOut, "days");
  this.rentalFee = rentalDays * this.movie.dailyRentalRate;
};

const Rental = mongoose.model("Rental", rentalSchema);

function validateRental(input) {
  const schema = Joi.object({
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required()
  });
  return schema.validate(input);
}

exports.Rental = Rental;
exports.validateRental = validateRental;
