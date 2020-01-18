const mongoose = require("mongoose");
const request = require("supertest");
const { Movie } = require("../../Models/Movies");
const { Customer } = require("../../Models/Customer");
const { Genre } = require("../../routs/genres");
const { Rental } = require("../../Models/Rental");
const { User } = require("../../Models/Users");

describe("/api/rentals", () => {
  let server;
  let genre;
  let movie;
  let customer;
  let rental;
  let customerId;
  let movieId;
  let token;
  function execPost() {
    return request(server)
      .post("/api/rentals")
      .set("x-auth-token", token)
      .send({ customerId, movieId });
  }

  beforeEach(async () => {
    server = require("../../app");
    token = new User().genAuthToken();
    genre = new Genre({ name: "Genre 123" });
    await genre.save();
    movie = new Movie({
      title: "War Front",
      genre: { _id: genre._id, name: genre.name },
      dailyRentalRate: 4,
      numberInStocK: 45
    });
    await movie.save();
    movieId = movie._id;

    customer = new Customer({
      name: "Umar Zakaria",
      phone: "0201348856",
      isGold: true
    });
    await customer.save();
    customerId = customer._id;
    rental = new Rental({
      customer: {
        _id: customer._id,
        name: customer.name,
        phone: customer.phone
      },
      movie: {
        _id: movie._id,
        title: movie.title
      },
      dailyRentalRate: movie.dailyRentalRate
    });
    await rental.save();
  });

  afterEach(async () => {
    await server.close();
    await Genre.remove({});
    await Movie.remove({});
    await Customer.remove({});
    await Rental.remove({});
  });

  describe("Get /", () => {
    it("should return  a status code of 200 with all rentals", async () => {
      const res = await request(server).get("/api/rentals");
      expect(res.status).toBe(200);
      expect(res.body[0]).toHaveProperty("customer.name", "Umar Zakaria");
      expect(res.body[0]).toHaveProperty("movie");
    });
  });

  describe("Post /", () => {
    it("Should return with status code 401 if not logged in", async () => {
      token = "";
      const res = await execPost();
      expect(res.status).toBe(401);
    });
    it("should return a status code 400 if logged in but request do not have right data", async () => {
      customerId = "56472372";
      movieId = "638409054";
      const res = await execPost();
      expect(res.status).toBe(400);
    });
    it("should return a status code 404 if logged in but provided movieId does not exist", async () => {
      await Movie.remove({});
      const res = await execPost();
      expect(res.status).toBe(404);
    });
    it("should return a status code 404 if logged in but provided customerId does not exist", async () => {
      await Customer.remove({});
      const res = await execPost();
      expect(res.status).toBe(404);
    });
    it("should return a status code 404 if logged in but provided movie is out of stock", async () => {
      movie = await Movie.findById(movie._id);
      movie.numberInStocK = 0;
      await movie.save();
      const res = await execPost();
      expect(res.status).toBe(400);
    });

    it("should return a status 200 if requirements are met", async () => {
      const res = await execPost();
      expect(res.status).toBe(200);
    });
  });
});
