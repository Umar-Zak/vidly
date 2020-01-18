const { Rental } = require("../../Models/Rental");
const mongoose = require("mongoose");
const request = require("supertest");
const moment = require("moment");
const { User } = require("../../Models/Users");
const { Movie } = require("../../Models/Movies");
describe("/api/renturns", () => {
  let server;
  let rental;
  let customerId;
  let movieId;
  let token;
  let movie;

  const exec = () => {
    return request(server)
      .post("/api/returns")
      .set("x-auth-token", token)
      .send({ customerId, movieId });
  };

  beforeEach(async () => {
    server = require("../../app");
    movieId = mongoose.Types.ObjectId();
    customerId = mongoose.Types.ObjectId();
    token = new User().genAuthToken();
    movie = new Movie({
      _id: movieId,
      title: "ywe62388",
      genre: { name: "Action" },
      numberInStocK: 10,
      dailyRentalRate: 2
    });
    await movie.save();
    rental = new Rental({
      customer: {
        _id: customerId,
        name: "12345",
        phone: "1234567890"
      },
      movie: {
        _id: movieId,
        title: "123456",
        dailyRentalRate: 2
      }
    });
    await rental.save();
  });
  afterEach(async () => {
    await server.close();
    await Rental.remove({});
    await Movie.remove({});
  });

  it("Should pass!", async () => {
    const result = await Rental.findById(rental._id);
    expect(result).not.toBeNull();
  });

  it("should return 401 status if not logged in", async () => {
    token = "";
    const res = await exec();
    expect(res.status).toBe(401);
  });
  it("should return 400 status if customerId is not provided", async () => {
    customerId = "";
    const res = await exec();
    expect(res.status).toBe(400);
  });
  it("should return 400 status if movieId is not provided", async () => {
    movieId = "";
    const res = await exec();
    expect(res.status).toBe(400);
  });
  it("should return 404 status if no rental is available for the given movieId and customerId", async () => {
    await Rental.remove({});
    const res = await exec();
    expect(res.status).toBe(404);
  });
  it("should return 400 status if return date of rental is set", async () => {
    rental.dateReturned = Date.now();
    await rental.save();
    const res = await exec();
    expect(res.status).toBe(400);
  });
  it("should return 200 status if valid request", async () => {
    const res = await exec();
    expect(res.status).toBe(200);
  });
  it("should set the returned date if valid request", async () => {
    await exec();
    const rentalInDb = await Rental.findById(rental._id);
    const diff = new Date() - rentalInDb.dateReturned;
    expect(diff).toBeLessThan(10 * 1000);
  });
  it("should calculate the rental fee if valid request", async () => {
    rental.dateOut = moment()
      .add(-7, "days")
      .toDate();
    await rental.save();
    await exec();
    const rentalInDb = await Rental.findById(rental._id);
    expect(rentalInDb.rentalFee).toBe(14);
  });
  it("should increment movie stock if valid request", async () => {
    await exec();
    const movieInDb = await Movie.findById(movieId);
    expect(movieInDb.numberInStocK).toBe(11);
  });
  it("should return rental valid request", async () => {
    const res = await exec();
    expect(Object.keys(res.body)).toEqual(
      expect.arrayContaining(["dateReturned", "rentalFee", "movie"])
    );
  });
});
