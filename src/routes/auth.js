"use strict";

const router = require("express").Router();

const auth = require("../controllers/auth");

router.route("/login").post(auth.login);

router.get("/logout", auth.logout);

module.exports = router;
