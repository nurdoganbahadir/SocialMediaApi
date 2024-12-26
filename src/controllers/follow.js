"use strict";

const Follow = require("../models/follow");
const User = require("../models/user");

module.exports = {
  list: async (req, res) => {
    const data = await res.getModelList(Follow);

    res.status(200).send({
      error: false,
      details: await res.getModelListDetails(Follow),
      data,
    });
  },

  create: async (req, res) => {
    console.log(req.body.followerId);

    const newFollow = await Follow.create({
      followingId: req.user._id,
      followerId: req.body.followerId,
    });

    await User.updateOne(
      { _id: req.body.followerId },
      { $push: { followers: req.user._id } }
    );

    await User.updateOne(
      { _id: req.user._id },
      { $push: { following: req.body.followerId } }
    );

    res.status(201).send({
      error: false,
      data: newFollow,
    });
  },

};
