"use strict";

const User = require("../models/user");
const Token = require("../models/token");
const passwordEncrypt = require("../helpers/passwordEncrypt");
const jwt = require("jsonwebtoken");
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

    // Simple Token
    let tokenData = await Token.findOne({ userId: user._id });
    if (!tokenData) {
      tokenData = await Token.create({
        userId: user._id,
        token: passwordEncrypt(user._id + Date.now()),
      });
    }

    // JWT
    const accessToken = jwt.sign(
      user.toJSON(),
      process.env.ACCESS_KEY,
      { expiresIn: "1h" }
    );
    const refreshToken = jwt.sign(
      { _id: user._id, password: user.password },
      process.env.REFRESH_KEY,
      { expiresIn: "1d" }
    );

    res.status(200).send({
      error: false,
      data: tokenData.token,
      bearer: {
        accessToken,
        refreshToken,
      },
    });
  },

  refresh: async (req, res) => {
    /*
            #swagger.tags = ['Authentication']
            #swagger.summary = 'JWT: Refresh'
            #swagger.description = 'Refresh access-token by refresh-token.'
            #swagger.parameters['body'] = {
                in: 'body',
                required: true,
                schema: {
                    bearer: {
                        refresh: '___refreshToken___'
                    }
                }
            }
        */

    const { refreshToken } = req.body.bearer;

    if (!refreshToken) {
      throw new NotFoundError("Refresh Token is required");
    }

    jwt.verify(
      refreshToken,
      process.env.REFRESH_KEY,
      async function (err, userData) {
        if (err) {
          res.errorStatusCode = 401;
          throw err;
        }

        const { _id, password } = userData;

        const user = await User.findOne({ _id });

        if (!user && user.password !== password) {
          res.errorStatusCode = 401;
          throw new Error("Wrong password or id.");
        }

        const accessToken = jwt.sign(user.toJSON(), process.env.ACCESS_KEY, {
          expiresIn: "30m",
        });

        res.status(200).send({
          error: false,
          bearer: { accessToken },
        });
      }
    );
  },

  logout: async (req, res) => {
    /*
            #swagger.tags = ["Authentication"]
            #swagger.summary = "Token: Logout"
            #swagger.description = 'Delete token-key.'
        */

    const auth = req.headers?.authorization || null; // "Token fdsalfkjasdlkfjlaskdfsd"
    const tokenKey = auth ? auth.split(" ") : null; // ['Token' , 'dsfasdfasdfasdfasd']

    let message = "No need any process for logout. You must delete JWT tokens.",
      result;

    if (tokenKey && tokenKey[0] === "Token") {
      // simple token

      result = await Token.deleteOne({ token: tokenKey[1] });
      message = "Token Deleted. Logout is success.";
    }

    res.send({
      error: false,
      message,
      result,
    });
  },
};
