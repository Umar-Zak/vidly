const request = require("supertest");
const { User } = require("../../Models/Users");
const bcrypt = require("bcrypt");
describe("/api/auth", () => {
  let user;
  let server;
  let body;
  function exceLogin(){
    return request(server)
    .post("/api/auth")
    .send(body);
  }
  beforeEach(async () => {
    server = require("../../app");
    body={ email: "umarabanga45@gmail.com", password: "0201348856" }
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
     body.email="invalid"
     const res=await exceLogin();
      expect(res.status).toBe(400);
    });
    it("should return with status 400 if the provided email doesnot exist", async () => {
      body.email="umarabanga451@gmail.com";
      const res=await exceLogin();
      expect(res.status).toBe(400);
    });
    it("should return with status 400 if the provided password is incorrect", async () => {
     body.password="0201348856123";
     const res=await exceLogin();
      expect(res.status).toBe(400);
    });
    it("should return with status 200 if the provided eamil & password are correct", async () => {
      
      expect(res.status).toBe(200);
    });
  });
});
