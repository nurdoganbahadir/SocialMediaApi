"use strict";

const Notification = require("../models/notification");

module.exports = {
  list: async (req, res) => {
    const notifications = await Notification.find({
      userId: req.user._id,
    });

    res.status(200).send({
      error: false,
      data: notifications,
    });
  },
};
