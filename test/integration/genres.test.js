let server;
const request = require("supertest");
const { Genre } = require("../../routs/genres");
const { User } = require("../../Models/Users");
const mongoose = require("mongoose");

describe("/api/genres", () => {
  let name;
  let token;
  let id;
  let newName;
  let user;
  const exec = async () => {
    return await request(server)
      .post("/api/genres")
      .set("x-auth-token", token)
      .send({ name });
  };

  excePut = () => {
    return request(server)
      .put(`/api/genres/${id}`)
      .set("x-auth-token", token)
      .send({ name: newName });
  };

  beforeEach(() => {
    server = require("../../app");
    name = "New Genre";
    token = new User().genAuthToken();
    id = mongoose.Types.ObjectId();
    newName = "New Genre";
    user = { _id: id, isAdmin: false };
  });
  afterEach(async () => {
    await server.close();
    await Genre.remove({});
  });
  describe("GET /", () => {
    it("Should return all genres", async () => {
      await Genre.collection.insertMany([
        { name: "Genre1" },
        { name: "Genre2" }
      ]);
      const res = await request(server).get("/api/genres");
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
    });
  });

  describe("GET /:id", () => {
    it("should return the genre with the given id", async () => {
      const genre = new Genre({ name: "genre1" });
      await genre.save();
      const res = await request(server).get(`/api/genres/${genre._id}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("name", "genre1");
    });

    it("Should return a response with status code 404", async () => {
      const res = await request(server).get("/api/genres/5e1896a8");
      expect(res.status).toBe(404);
    });
  });

  describe("Post /", () => {
    it("should return 401 if not logged in", async () => {
      token = "";
      const res = await exec();
      expect(res.status).toBe(401);
    });
    it("should return 400 if genre is less than 5 characters", async () => {
      name = "1234";
      const res = await exec();
      expect(res.status).toBe(400);
    });
    it("should return 400 if genre is more than 50 characters", async () => {
      name = new Array(52).join("a");
      const res = await exec();
      expect(res.status).toBe(400);
    });
    it("should return the genre saved", async () => {
      const res = await exec();
      const genre = await Genre.find({ name: "New Genre" });
      expect(genre[0]).toHaveProperty("name", "New Genre");
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("name", "New Genre");
      expect(res.body).toHaveProperty("_id");
    });
  });

  describe("PUT /id", () => {
    it("should return 400 status if name of genre is not valid", async () => {
      newName = "";
      const res = await excePut();
      expect(res.status).toBe(400);
    });
    it("should return 404 status if id of genre is not valid", async () => {
      id = "12345";
      const res = await excePut();
      expect(res.status).toBe(404);
    });
    it("should return 404 status if   genre is not found", async () => {
      const res = await excePut();
      expect(res.status).toBe(404);
    });
    it("should return 200 status if   genre is updated", async () => {
      id = mongoose.Types.ObjectId();
      let genre = { _id: id, name: "Genr1" };
      genre = new Genre(genre);
      genre = await genre.save();
      const res = await excePut();
      expect(res.status).toBe(200);
    });
  });

  describe("DELETE /id", () => {
    it("should return 403 if not admin", async () => {
      const adminToken = new User(user).genAuthToken();
      const res = await request(server)
        .delete("/api/genres/23676745")
        .set("x-auth-token", adminToken);
      expect(res.status).toBe(403);
    });
    // it("should return 404 if id is invalid", async () => {
    //   user.isAdmin = true;
    //   const adminToken = new User(user).genAuthToken();
    //   const res = await request(server)
    //     .delete("/api/genres/23676745")
    //     .set("x-auth-token", adminToken);
    //   expect(res.status).toBe(404);
    // });
    // it("should return 404 if genre is not available", async () => {
    //   user.isAdmin = true;
    //   const adminToken = new User(user).genAuthToken();
    //   const res = await request(server)
    //     .delete(`/api/genres/${id}`)
    //     .set("x-auth-token", adminToken);
    //   expect(res.status).toBe(404);
    // });
  });
});
