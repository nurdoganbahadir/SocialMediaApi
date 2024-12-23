"use strict ";

const { mongoose } = require("../configs/dbConnection");

const CommentSchema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      trim: true,
      required: true,
    },
  },
  { collection: "comments", timestamps: true }
);

module.exports = mongoose.model("Comment", CommentSchema);
