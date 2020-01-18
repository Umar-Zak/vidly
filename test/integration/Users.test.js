const request = require("supertest");
const { User } = require("../../Models/Users");

describe("/api/users", () => {
  let server;
  let name;
  let password;
  let email;

  function execPost() {
    return request(server)
      .post("/api/users")
      .send({
        name,
        email,
        password
      });
  }

  beforeEach(() => {
    server = require("../../app");
    name = "Umar Abanga";
    (email = "umarabanga78@gmail.com"), (password = "348238029334");
  });

  afterEach(async () => {
    await server.close();
    await User.remove({});
  });

  describe("/me", () => {
    it("Should return with status 401 if not logged in", async () => {
      const res = await request(server).get("/api/users/me");
      expect(res.status).toBe(401);
    });
    it("Should return with status 200 if  logged in", async () => {
      const token = new User().genAuthToken();
      const res = await request(server)
        .get("/api/users/me")
        .set("x-auth-token", token);
      expect(res.status).toBe(200);
    });
  });
  describe("Post /", () => {
    it("should return 400 if request does not conatian right data", async () => {
      email = "weyquiiuwe8292";
      const res = await execPost();
      expect(res.status).toBe(400);
    });
    it("should return 400 if user already exists", async () => {
      const user = new User({
        name: "Frank Lampard",
        email: "umarabanga78@gmail.com",
        password: "37472830985445"
      });
      await user.save();
      const res = await execPost();
      expect(res.status).toBe(400);
    });
    it("should return 200 if user does not exist", async () => {
      const res = await execPost();
      expect(res.status).toBe(200);
    });
  });
});
