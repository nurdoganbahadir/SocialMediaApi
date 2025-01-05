"use strict";

const express = require("express");
const app = express();

require("dotenv").config();

const PORT = process.env?.PORT || 8000;

require("express-async-errors");

const { dbConnection } = require("./src/configs/dbConnection");
dbConnection();

// Middlewares

app.use(express.json());

app.use(require("./src/middlewares/authentication"));

app.use(require("./src/middlewares/logger"));

app.use(require("./src/middlewares/queryHandler"));

/*------------------------------------*/
// Routes

app.all("/", (req, res) => {
  res.send({
    error: false,
    message: "Welcome to the Social Media API",
    documents: {
      swagger: "/documents/swagger",
      redoc: "/documents/redoc",
      json: "/documents/json",
    },
    user: req.user,
  });
});

app.use("/", require("./src/routes"));

app.all("*", (req, res) => {
  res.status(404).send({
    error: true,
    message: "Route is not found!",
  });
});

/*------------------------------------*/

app.use(require("./src/middlewares/errorHandler"));

app.listen(PORT, () => {
  console.log("http://127.0.0.1:" + PORT);
});
