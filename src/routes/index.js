"use strict";

const router = require("express").Router();

router.use("/auth", require("./auth"));
router.use("/user", require("./user"));
router.use("/token", require("./token"));
router.use("/post", require("./post"));
router.use("/token", require("./token"));
router.use("/comment", require("./comment"));
router.use("/like", require("./like"));
router.use("/story", require("./story"));

module.exports = router;
