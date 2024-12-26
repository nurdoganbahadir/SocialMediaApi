"use strict";

const router = require("express").Router();
const { isLogin } = require("../middlewares/permissions");
const stories = require("../controllers/story");

router.route("/").get(stories.list).post(isLogin, stories.create);

router
  .route("/:id")
  .get(stories.read)
  .put(isLogin, stories.update)
  .patch(isLogin, stories.update)
  .delete(isLogin, stories.delete);

module.exports = router;
