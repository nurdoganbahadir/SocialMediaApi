"use strict";

const router = require("express").Router();
const { isLogin } = require("../middlewares/permissions");
const comment = require("../controllers/comment");

router.route("/").get(comment.list).post(isLogin, comment.create);

router
  .route("/:id")
  .get(comment.read)
  .put(isLogin, comment.update)
  .patch(isLogin, comment.update)
  .delete(isLogin, comment.delete);

module.exports = router;
