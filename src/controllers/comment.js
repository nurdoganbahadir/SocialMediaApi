"use strict";

const Comment = require("../models/comment");
const Post = require("../models/post");
const Notification = require("../models/notification");
module.exports = {
  list: async (req, res) => {
    // const data = await res.getModelList(Comment).populate("userId");
    const data = await Comment.find().populate(
      "userId",
      "-password -__v -email -birthdate -followers -following -createdAt -updatedAt -bio"
    );

    res.status(200).send({
      error: false,
      details: await res.getModelListDetails(Comment),
      data,
    });
  },

  create: async (req, res) => {
    const { postId, content } = req.body;

    const { userId } = await Post.findOne({ _id: postId }).select("userId");

    const newComment = await Comment.create({
      postId,
      userId: req.user._id,
      content,
    });

    await Post.updateOne(
      { _id: postId },
      { $push: { comments: newComment._id } }
    );

    await Notification.create({
      userId: userId.toString(),
      type: "message",
      message: `${req.user.username} commented on your post`,
    });

    res.status(201).send({
      error: false,
      data: newComment,
    });
  },

  read: async (req, res) => {
    const data = await Comment.findOne({ _id: req.params.id }).populate(
      "userId",
      "-password -__v -email -birthdate -followers -following -createdAt -updatedAt -bio"
    );

    res.status(200).send({
      error: false,
      data,
    });
  },
  update: async (req, res) => {
    const data = await Comment.updateOne({ _id: req.params.id }, req.body, {
      runValidators: true,
    });

    res.status(202).send({
      error: false,
      data,
    });
  },

  delete: async (req, res) => {
    const data = await Comment.deleteOne({ _id: req.params.id });

    res.status(data.deletedCount ? 204 : 404).send({
      error: !data.deletedCount,
      data,
    });
  },
};
