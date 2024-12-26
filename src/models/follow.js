"use strict";

const { mongoose } = require("../configs/dbConnection");

const FollowSchema = new mongoose.Schema({
  followingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  followerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Follow", FollowSchema);
