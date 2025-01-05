"use strict";

const Like = require("../models/like");
const Post = require("../models/post");
const Notification = require("../models/notification");

module.exports = {
  list: async (req, res) => {
    /* 
            #swagger.tags = ["Like"]
            #swagger.summary = "List Likes"]"
            #swagger.description = `
                You can send query with endpoint for search[], sort[], page and limit.
                <ul> Examples:
                    <li>URL/?<b>search[field1]=value1&search[field2]=value2</b></li>
                    <li>URL/?<b>sort[field1]=1&sort[field2]=-1</b></li>
                    <li>URL/?<b>page=2&limit=1</b></li>
                </ul>
            `
        */

    const data = await Like.find().populate(
      "userId",
      "-password -__v -email -birthdate -followers -following -createdAt -updatedAt -bio"
    );

    res.status(200).send({
      error: false,
      details: await res.getModelListDetails(Like),
      data,
    });
  },

  create: async (req, res) => {
    /* 
            #swagger.tags = ["Like"]
            #swagger.summary = "Create Likes"
            #swagger.parameters['body'] = {
                in:'body',
                required:true,
                schema:{
                  "userId": "676b19c7af816bcb25dfc2cc",
                  "postId": "6769e39bd0142b31debd09fa"
                }
            }
        */

    const { postId } = req.body;

    const { userId } = await Post.findOne({ _id: postId }).select("userId");

    const newLike = await Like.create({
      postId,
      userId: req.user._id,
    });

    await Post.updateOne({ _id: postId }, { $push: { likes: newLike._id } });

    // Bildirim oluştur
    await Notification.create({
      userId: userId.toString(),
      type: "message",
      message: `${req.user.username} liked your post`,
    });

    res.status(201).json({
      error: false,
      data: newLike,
    });
  },

  read: async (req, res) => {
    /* 
           #swagger.tags = ["Like"]
           #swagger.summary = "Get Single Like"
        */

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
    /* 
            #swagger.tags = ["Like"]
            #swagger.summary = "Update Like"
            #swagger.parameters['body'] = {
                in:'body',
                required:true,
                schema:{
                    "userId": "676b19c7af816bcb25dfc2cc",
                   "postId": "6769e39bd0142b31debd09fa"
                }
            }
        */

    const data = await Like.updateOne({ _id: req.params.id }, req.body, {
      runValidators: true,
    });

    res.status(202).json({
      error: false,
      data,
    });
  },

  delete: async (req, res) => {
    /* 
            #swagger.tags = ["Like"]
            #swagger.summary = "Delete Single Like"
        */

    const data = await Like.deleteOne({ _id: req.params.id });

    res.status(data.deletedCount ? 204 : 404).send({
      error: !data.deletedCount,
      data,
    });
  },
};
