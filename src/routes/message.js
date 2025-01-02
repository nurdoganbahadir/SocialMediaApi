"use strict";

const router = require("express").Router();
const message = require("../controllers/message");

router.route("/").post(message.sendMessage);

router.get("/conversation/:conversationId", message.getMessages);
router.get(
  "/conversation/:conversationId/details",
  message.getConversation
);

module.exports = router;
