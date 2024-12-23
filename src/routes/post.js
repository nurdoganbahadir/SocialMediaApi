"use strict";

const router = require("express").Router();
const { isLogin } = require("../middlewares/permissions");
const post = require("../controllers/post");

router.route("/").get(post.list).post(isLogin, post.create);

router
  .route("/:id")
  .get(post.read)
  .put(isLogin, post.update)
  .patch(isLogin, post.update)
  .delete(isLogin, post.delete);

module.exports = router;
