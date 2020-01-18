const request = require("supertest");
const { Movie } = require("../../Models/Movies");
const { Genre } = require("../../routs/genres");
const mongoose = require("mongoose");
const { User } = require("../../Models/Users");

describe("Movies endPoints", () => {
  let server;
  let id;
  let genre;
  let movie;
  let token;
  let body;

  function excePost() {
    return request(server)
      .post("/api/movies")
      .set("x-auth-token", token)
      .send(body);
  }
  function execPut() {
    return request(server)
      .put("/api/movies/" + id)
      .set("x-auth-token", token)
      .send(body);
  }

  function execDelete() {
    return request(server)
      .delete("/api/movies/" + id)
      .set("x-auth-token", token);
  }
  function exceGet() {
    return request(server).get("/api/movies/" + id);
  }

  beforeEach(async () => {
    server = require("../../app");
    genreId = mongoose.Types.ObjectId();
    genre = new Genre({ name: "Genre 12" });
    await genre.save();
    movie = new Movie({
      title: "War Front",
      genre: {
        _id: genre.id,
        name: genre.name
      },
      dailyRentalRate: 3,
      numberInStocK: 34
    });
    await movie.save();
    id = movie._id;
    body = {
      title: "War Front",
      genreId: genre._id,
      dailyRentalRate: 4,
      numberInStocK: 56
    };
    token = new User().genAuthToken();
  });

  afterEach(async () => {
    await server.close();
    await Genre.remove({});
    await Movie.remove({});
  });

  describe("Get /", () => {
    it("Should return all movies with status code 200", async () => {
      const res = await request(server).get("/api/movies");
      expect(res.status).toBe(200);
      expect(res.body[0]).toHaveProperty("title", "War Front");
      expect(res.body[0]).toHaveProperty("genre");
    });
  });
  describe("Get /:id", () => {
    it("Should return with status code 404 if invalid object Id is passed", async () => {
      id = "35467848843";
      const res = await exceGet();
      expect(res.status).toBe(404);
    });

    it("Should return with status code 404 if the movieId passed is not available ", async () => {
      await Movie.remove({});
      const res = await exceGet();
      expect(res.status).toBe(404);
    });
    it("Should return with status code 200 if the movieId passed is valid", async () => {
      const res = await exceGet();
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("title", "War Front");
    });
  });
  describe("post /", () => {
    it("should return with status 401 if not logged in", async () => {
      token = "";
      const res = await excePost();
      expect(res.status).toBe(401);
    });
    it("should return with status 400 if request body has bad data", async () => {
      body = {};
      const res = await excePost();
      expect(res.status).toBe(400);
    });
    it("should return with status 404 if the genre provided is not available", async () => {
      await Genre.remove({});
      const res = await excePost();
      expect(res.status).toBe(404);
    });
    it("should return with status 200 if request body has right data", async () => {
      const res = await excePost();
      const movieInDb = await Movie.findById(res.body._id);
      expect(res.status).toBe(200);
      expect(movieInDb).toBeDefined();
      expect(movieInDb).toHaveProperty("title", "War Front");
      expect(movieInDb).toHaveProperty("genre");
    });
  });
  describe("Put /:id", () => {
    it("should return 401 if not logged in", async () => {
      token = "";
      const res = await execPut();
      expect(res.status).toBe(401);
    });
    it("should return 404 if movieid is not valid", async () => {
      id = "243778484";
      const res = await execPut();
      expect(res.status).toBe(404);
    });
    it("should return 404 if the genre provided is not available", async () => {
      await Genre.remove({});
      const res = await execPut();
      expect(res.status).toBe(404);
    });
    it("should return 200 if the request is valid", async () => {
      const res = await execPut();
      expect(res.status).toBe(200);
    });
  });
  describe("Delete /:id", () => {
    it("Should return a status of 401 if not logged in", async () => {
      token = "";
      const res = await execDelete();
      expect(res.status).toBe(401);
    });
    it("Should return a status of 403 if not Admin", async () => {
      const res = await execDelete();
      expect(res.status).toBe(403);
    });
    it("Should return a status of 404 if movieId is not valid", async () => {
      token = new User({
        _id: mongoose.Types.ObjectId(),
        isAdmin: true
      }).genAuthToken();
      id = "35467238823";
      const res = await execDelete();
      expect(res.status).toBe(404);
    });
    it("Should return a status of 200 if request is  valid", async () => {
      token = new User({
        _id: mongoose.Types.ObjectId(),
        isAdmin: true
      }).genAuthToken();
      const res = await execDelete();
      expect(res.status).toBe(200);
    });
  });
});
