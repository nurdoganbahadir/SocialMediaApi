"use strict";

const router = require("express").Router();
const { list } = require("../controllers/notification");

router.route("/").get(list);

module.exports = router;