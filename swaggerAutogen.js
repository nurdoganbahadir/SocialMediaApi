"use strict";

require("dotenv").config();
const PORT = process.env.PORT || 8000;

const swaggerAutogen = require("swagger-autogen")();
const packageJson = require("./package.json");

const document = {
  info: {
    title: packageJson.name,
    description: packageJson.description,
    version: packageJson.version,
  },
  host: `localhost:${PORT}`,
  basePath: "/",
  schemes: ["http", "https"],
  consumes: ["application/json"],
  produces: ["application/json"],
  securityDefinitions: {
    Token: {
      type: "apiKey",
      in: "header",
      name: "Authorization",
      description:
        "Simple Token Authentication * Example: <b>Token ...tokenKey...</b>",
    },
    Bearer: {
      type: "apiKey",
      in: "header",
      name: "Authorization",
      description:
        "JWT Authentication * Example: <b>Bearer ...accessToken...</b>",
    },
  },
  security: [{ Token: [] }, { Bearer: [] }],
  definations: {
    User: require("./src/models/user").schema.obj,
    Post: require("./src/models/post").schema.obj,
    Comment: require("./src/models/comment").schema.obj,
    Like: require("./src/models/like").schema.obj,
    Message: require("./src/models/message").schema.obj,
    Notification: require("./src/models/notification").schema.obj,
    Story: require("./src/models/story").schema.obj,
    Follow: require("./src/models/follow").schema.obj,
  },
};

const routes = ["./index.js"];
const outputFile = "./src/configs/swagger.js";

swaggerAutogen(outputFile, routes, document);
