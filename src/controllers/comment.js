"use strict";

const Comment = require("../models/comment");
const Post = require("../models/post");
const Notification = require("../models/notification");
module.exports = {
  list: async (req, res) => {
    /* 
            #swagger.tags = ["Comments"]
            #swagger.summary = "List Comments"]"
            #swagger.description = `
                You can send query with endpoint for search[], sort[], page and limit.
                <ul> Examples:
                    <li>URL/?<b>search[field1]=value1&search[field2]=value2</b></li>
                    <li>URL/?<b>sort[field1]=1&sort[field2]=-1</b></li>
                    <li>URL/?<b>page=2&limit=1</b></li>
                </ul>
            `
        */

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
    /* 
            #swagger.tags = ["Comments"]
            #swagger.summary = "Create Comment"
            #swagger.parameters['body'] = {
                in:'body',
                required:true,
                schema:{
                  "userId": "676b19c7af816bcb25dfc2cc",
                  "postId": "6769e39bd0142b31debd09fa",
                  "content": "example comment"
                }
            }
        */

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
    /* 
           #swagger.tags = ["Comments"]
           #swagger.summary = "Get Single Comment"
        */

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
    /* 
            #swagger.tags = ["Comments"]
            #swagger.summary = "Update Comment"
            #swagger.parameters['body'] = {
                in:'body',
                required:true,
                schema:{
                    "userId": "676b19c7af816bcb25dfc2cc",
                   "postId": "6769e39bd0142b31debd09fa",
                   "content": "example comment"
                }
            }
        */

    const data = await Comment.updateOne({ _id: req.params.id }, req.body, {
      runValidators: true,
    });

    res.status(202).send({
      error: false,
      data,
    });
  },

  delete: async (req, res) => {
    /* 
            #swagger.tags = ["Comments"]
            #swagger.summary = "Delete Single Comment"
        */

    const data = await Comment.deleteOne({ _id: req.params.id });

    res.status(data.deletedCount ? 204 : 404).send({
      error: !data.deletedCount,
      data,
    });
  },
};
