"use strict";

const Post = require("../models/post");

module.exports = {
  list: async (req, res) => {
    const data = await res.getModelList(Post, {}, "comments");

    res.status(200).send({
      error: false,
      details: await res.getModelListDetails(Post),
      data,
    });
  },
  create: async (req, res) => {
    const data = await Post.create({ ...req.body, userId: req.user._id });

    res.status(201).send({
      error: false,
      data,
    });
  },

  read: async (req, res) => {
    const data = await Post.findOne({ _id: req.params.id }).populate(
      "comments"
    );

    res.status(200).send({
      error: false,
      data,
    });
  },
  update: async (req, res) => {
    const data = await Post.updateOne({ _id: req.params.id }, req.body, {
      runValidators: true,
    });

    res.status(200).send({
      error: false,
      data,
      new: await Post.findOne({ _id: req.params.id }).populate("comments"),
    });
  },
  delete: async (req, res) => {
    const data = await Post.deleteOne({ _id: req.params.id });

    res.status(data.deletedCount ? 204 : 404).send({
      error: !data.deletedCount,
      data,
    });
  },
};
