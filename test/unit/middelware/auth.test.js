const { User } = require("../../../Models/Users");
const auth = require("../../../Middleware/auth");
const mongoose = require("mongoose");

describe("auth middleware", () => {
  it("should populate req.user with the payload of valid JWT", () => {
    const user = {
      _id: mongoose.Types.ObjectId().toHexString(),
      isAdmin: true
    };
    const token = new User(user).genAuthToken();
    const req = {
      header: jest.fn().mockReturnValue(token)
    };
    const next = jest.fn();
    const res = {};
    auth(req, res, next);
    expect(req.user).toMatchObject(user);
  });
});
