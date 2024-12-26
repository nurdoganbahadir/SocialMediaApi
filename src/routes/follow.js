"use strict";

const router = require("express").Router();

const follow = require("../controllers/follow");

router.route("/").get(follow.list).post(follow.create);

module.exports = router;
