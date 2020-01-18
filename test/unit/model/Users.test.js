const { User } = require("../../../Models/Users");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const config = require("config");

describe("user.genAuthToken", () => {
  it("should decode the json web token", () => {
    const payload = {
      _id: mongoose.Types.ObjectId().toHexString(),
      isAdmin: true
    };
    const user = new User(payload);
    const token = user.genAuthToken();
    const decoded = jwt.verify(token, config.get("privatekey"));
    expect(decoded).toMatchObject(payload);
  });
});
