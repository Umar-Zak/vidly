const request = require("supertest");
const { User } = require("../../Models/Users");
const { Customer } = require("../../Models/Customer");

describe("/api/customers", () => {
  let server;
  let customer;
  let id;
  let token;
  let body;

  function execGet() {
    return request(server).get("/api/customers/" + id);
  }

  function execPost() {
    return request(server)
      .post("/api/customers")
      .set("x-auth-token", token)
      .send(body);
  }

  function execPut() {
    return request(server)
      .put("/api/customers/" + id)
      .set("x-auth-token", token)
      .send(body);
  }

  function execDelete() {
    return request(server)
      .delete("/api/customers/" + id)
      .set("x-auth-token", token);
  }

  beforeEach(async () => {
    server = require("../../app");
    token = new User().genAuthToken();
    body = { name: "Umar Zak", isGold: false, phone: "0201348856" };
    customer = new Customer({
      name: "Umar Zakaria",
      isGold: true,
      phone: "0201348856"
    });
    await customer.save();
    id = customer._id;
  });

  afterEach(async () => {
    await server.close();
    await Customer.remove({});
  });

  describe("Get /", () => {
    it("Should return all customers with status 200", async () => {
      const res = await request(server).get("/api/customers");
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
    });
  });
  describe("Get /:id", () => {
    it("Should return status of 404 if objectid is not valid", async () => {
      id = "53258ufgkngmm3o0334";
      const res = await execGet();
      expect(res.status).toBe(404);
    });
    it("Should return status of 404 if the specified customer is not available", async () => {
      await Customer.remove({});
      const res = await execGet();
      expect(res.status).toBe(404);
    });
    it("Should return the customer object with the given id", async () => {
      const res = await execGet();
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("name", "Umar Zakaria");
      expect(res.body).toHaveProperty("phone", "0201348856");
    });
  });

  describe("Post /", () => {
    it("Should return with status 401 if not logged in", async () => {
      token = "";
      const res = await execPost();
      expect(res.status).toBe(401);
    });
    it("Should return with status 400 if data in body is not valid", async () => {
      body.phone = "";
      const res = await execPost();
      expect(res.status).toBe(400);
    });
    it("Should return with status 200 if logged in with right data in request body", async () => {
      const res = await execPost();
      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({ name: "Umar Zak", phone: "0201348856" });
    });
  });

  describe("Put /:id", () => {
    it("should return with status 401 if not logged in", async () => {
      token = "";
      const res = await execPut();
      expect(res.status).toBe(401);
    });
    it("should return with status 404 if  logged in but objectid is invalid", async () => {
      id = "532798509-43dhhsds";
      const res = await execPut();
      expect(res.status).toBe(404);
    });
    it("should return with status 400 if  logged in but request data is bad", async () => {
      body.phone = "";
      const res = await execPut();
      expect(res.status).toBe(400);
    });
    it("should return with status 404 if  logged in but customer is not available", async () => {
      await Customer.remove({});
      const res = await execPut();
      expect(res.status).toBe(404);
    });
    it("should return with status 200 if  logged in and valid request", async () => {
      const res = await execPut();
      expect(res.status).toBe(200);
    });
  });

  describe("Delete /:id", () => {
    it("Should return with status 401 if not logged in", async () => {
      token = "";
      const res = await execDelete();
      expect(res.status).toBe(401);
    });
    it("Should return with status 403 if  logged in but not admin", async () => {
      const res = await execDelete();
      expect(res.status).toBe(403);
    });
    it("Should return with status 404 if  logged in  as admin but invalid objectid", async () => {
      token = new User({ isAdmin: true }).genAuthToken();
      id = "6488340909023";
      const res = await execDelete();
      expect(res.status).toBe(404);
    });
    it("Should return with status 404 if  logged in  as admin but customer unavailable", async () => {
      token = new User({ isAdmin: true }).genAuthToken();
      await Customer.remove({});
      const res = await execDelete();
      expect(res.status).toBe(404);
    });
    it("Should return with status 200 if  logged in  as admin and valid request data", async () => {
      token = new User({ isAdmin: true }).genAuthToken();
      const res = await execDelete();
      expect(res.status).toBe(200);
    });
  });
});
