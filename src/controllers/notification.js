"use strict";

const Notification = require("../models/notification");

module.exports = {
  list: async (req, res) => {
    /* 
            #swagger.tags = ["Notification"]
            #swagger.summary = "List Notifications"]"
        */

    const notifications = await Notification.find({
      userId: req.user._id,
    });

    res.status(200).send({
      error: false,
      data: notifications,
    });
  },
};
