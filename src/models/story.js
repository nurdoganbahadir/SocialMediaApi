"use strict";

const { mongoose } = require("../configs/dbConnection");

const StorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    mediaUrl: {
      type: String,
      required: true,
    },
    expireAt: {
      type: Date,
      default: Date.now,
      index: { expires: "24h" },
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: "stories" }
);

module.exports = mongoose.model("Story", StorySchema);
