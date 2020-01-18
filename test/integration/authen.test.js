const request = require("supertest");
const { User } = require("../../Models/Users");
const bcrypt = require("bcrypt");
describe("/api/auth", () => {
  let user;
  let server;
  beforeEach(async () => {
    server = require("../../app");
    user = new User({
      name: "Umar Zakaria",
      email: "umarabanga45@gmail.com",
      password: "0201348856",
      isAdmin: false
    });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();
  });

  afterEach(async () => {
    await server.close();
    await User.remove({});
  });

  describe("/", () => {
    it("should return with status 400 if request contains bad data", async () => {
      const res = await request(server)
        .post("/api/auth")
        .send({ email: "ewyweyuiyweiow", password: "0201348856" });
      expect(res.status).toBe(400);
    });
    it("should return with status 400 if the provided email doesnot exist", async () => {
      const res = await request(server)
        .post("/api/auth")
        .send({ email: "umarabanga451@gmail.com", password: "0201348856" });
      expect(res.status).toBe(400);
    });
    it("should return with status 400 if the provided password is incorrect", async () => {
      const res = await request(server)
        .post("/api/auth")
        .send({ email: "umarabanga45@gmail.com", password: "0201348856123" });
      expect(res.status).toBe(400);
    });
    it("should return with status 200 if the provided eamil & password are correct", async () => {
      const res = await request(server)
        .post("/api/auth")
        .send({ email: "umarabanga45@gmail.com", password: "0201348856" });
      expect(res.status).toBe(200);
    });
  });
});
