"use strict";

const { mongoose } = require("../configs/dbConnection");

const NotificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    type: {
      type: String,
      enum: ["like", "follow", "comment", "message"],
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  { collection: "notifications", timestamps: true }
);
module.exports = mongoose.model("Notification", NotificationSchema);
