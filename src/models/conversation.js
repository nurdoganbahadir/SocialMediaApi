"use strict";

const mongoose = require("mongoose");

const ConversationSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
  },
  { collection: "conversations", timestamps: true }
);

module.exports = mongoose.model("Conversation", ConversationSchema);
