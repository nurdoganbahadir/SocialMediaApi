"use strict";

const Like = require("../models/like");
const Post = require("../models/post");
const { update } = require("./comment");

module.exports = {
  list: async (req, res) => {
    const data = await Like.find().populate(
      "userId",
      "-password -__v -email -birthdate -followers -following -createdAt -updatedAt -bio"
    );

    res.status(200).json({
      error: false,
      details: await res.getModelListDetails(Like),
      data,
    });
  },

  create: async (req, res) => {
    const { postId } = req.body;

    const newLike = await Like.create({
      postId,
      userId: req.user._id,
    });

    await Post.updateOne({ _id: postId }, { $push: { likes: newLike._id } });

    res.status(201).json({
      error: false,
      data: newLike,
    });
  },

  read: async (req, res) => {
    const data = await Like.findOne({ _id: req.params.id }).populate(
      "userId",
      "-password -__v -email -birthdate -followers -following -createdAt -updatedAt -bio"
    );

    res.status(200).json({
      error: false,
      data,
    });
  },

  update: async (req, res) => {
    const data = await Like.updateOne({ _id: req.params.id }, req.body, {
      runValidators: true,
    });

    res.status(202).json({
      error: false,
      data,
    });
  },

  delete: async (req, res) => {
    const data = await Like.deleteOne({ _id: req.params.id });

    res.status(data.deletedCount ? 204 : 404).send({
      error: !data.deletedCount,
      data,
    });
  },
};
