const request = require("supertest");
const { User } = require("../../Models/Users");
const { Genre } = require("../../routs/genres");
let server;

describe("auth middleware", () => {
  let token;
  const exec = () => {
    return request(server)
      .post("/api/genres")
      .set("x-auth-token", token)
      .send({ name: "New Genre" });
  };
  beforeEach(() => {
    server = require("../../app");
    token = new User().genAuthToken();
  });
  afterEach(async () => {
    await server.close();
    await Genre.remove({});
  });

  it("should return status 401 if no token is provided", async () => {
    token = "";
    const res = await exec();
    expect(res.status).toBe(401);
  });
  it("should return status 400 if token is invalid", async () => {
    token = "thsdjjs";
    const res = await exec();
    expect(res.status).toBe(400);
  });
  it("should return status 200 if token is valid", async () => {
    const res = await exec();
    expect(res.status).toBe(200);
  });
});
