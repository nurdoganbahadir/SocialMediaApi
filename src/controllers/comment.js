"use strict";

const authentication = require("../middlewares/authentication");
const Comment = require("../models/comment");
const Post = require("../models/post");
const { UnauthorizedError } = require("../errors/customError");

module.exports = {
  list: async (req, res) => {
    // const data = await res.getModelList(Comment).populate("userId");
    const data = await Comment.find().populate(
      "userId",
      "-password -__v -email -password -birthdate -followers -following -createdAt -updatedAt -bio"
    );

    res.status(200).send({
      error: false,
      details: await res.getModelListDetails(Comment),
      data,
    });
  },
  create: async (req, res) => {
    const { postId, content } = req.body;

    const newComment = await Comment.create({
      postId,
      userId: req.user._id,
      content,
    });

    await Post.updateOne(
      { _id: postId },
      { $push: { comments: newComment._id } }
    );

    res.status(201).send({
      error: false,
      data: newComment,
    });

    res.status(201).send({
      error: false,
      data,
    });
  },

  read: async (req, res) => {
    const data = await Comment.findOne({ _id: req.params.id }).populate(
      "userId",
      "-password -__v -email -password -birthdate -followers -following -createdAt -updatedAt -bio"
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
