"use strict";

const like = require("../controllers/like");
const { isLogin } = require("../middlewares/permissions");

const router = require("express").Router();

router.route("/").get(like.list).post(isLogin, like.create);

router
  .route("/:id")
  .get(like.read)
  .put(isLogin, like.update)
  .patch(isLogin, like.update)
  .delete(isLogin, like.delete);

module.exports = router;
