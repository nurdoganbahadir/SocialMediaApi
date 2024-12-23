"use strict";

const User = require("../models/user");
const Token = require("../models/token");
const passwordEncrypt = require("../helpers/passwordEncrypt");
const {
  UnauthorizedError,
  BadRequestError,
  NotFoundError,
} = require("../errors/customError");

module.exports = {
  login: async (req, res) => {
    const { username, email, password } = req.body;
    if (!((username || email) && password)) {
      throw new BadRequestError("Username or email and password is required");
    }

    const user = await User.findOne({ $or: [{ username }, { email }] });
    if (!user) {
      throw new NotFoundError("username/email is not found");
    }

    if (user.password !== passwordEncrypt(password)) {
      throw new UnauthorizedError("Password is incorrect");
    }

    let tokenData = await Token.findOne({ userId: user._id });

    if (!tokenData) {
      const tokenKey = passwordEncrypt(user._id + Date.now());
      tokenData = await Token.create({ userId: user._id, token: tokenKey });
    }
    res.status(200).send({
      error: false,
      data: tokenData.token,
      user,
    });
  },
  logout: async (req, res) => {
    const auth = req.headers?.authorization || null;
    const tokenKey = auth ? auth.split(" ") : null;
    let deleted = null;

    if (!tokenKey) {
      return res.status(400).send({
        error: true,
        message: "Invalid token.",
      });
    }

    if (tokenKey?.at(0) === "Token") {
      deleted = await Token.deleteOne({ token: tokenKey[1] });
    }
    res.send({
      error: false,
      message: "Token deleted. Logout was OK.",
      deleted,
    });
  },
};
