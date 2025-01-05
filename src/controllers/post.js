"use strict";

const Post = require("../models/post");

module.exports = {
  list: async (req, res) => {
    /* 
            #swagger.tags = ["Post"]
            #swagger.summary = "List Posts"]"
            #swagger.description = `
                You can send query with endpoint for search[], sort[], page and limit.
                <ul> Examples:
                    <li>URL/?<b>search[field1]=value1&search[field2]=value2</b></li>
                    <li>URL/?<b>sort[field1]=1&sort[field2]=-1</b></li>
                    <li>URL/?<b>page=2&limit=1</b></li>
                </ul>
            `
        */

    const data = await res.getModelList(Post, {}, "comments likes");

    res.status(200).send({
      error: false,
      details: await res.getModelListDetails(Post),
      data,
    });
  },
  create: async (req, res) => {
    /* 
            #swagger.tags = ["Post"]
            #swagger.summary = "Create Post"
            #swagger.parameters['body'] = {
                in:'body',
                required:true,
                schema:{
                  "content":"Example Post"
                }
            }
        */

    const data = await Post.create({ ...req.body, userId: req.user._id });


    res.status(201).send({
      error: false,
      data,
    });
  },

  read: async (req, res) => {
    /* 
           #swagger.tags = ["Post"]
           #swagger.summary = "Get Single Post"
        */
    const data = await Post.findOne({ _id: req.params.id }).populate(
      "comments"
    );

    res.status(200).send({
      error: false,
      data,
    });
  },
  update: async (req, res) => {
    /* 
            #swagger.tags = ["Post"]
            #swagger.summary = "Update Post"
            #swagger.parameters['body'] = {
                in:'body',
                required:true,
                schema:{
                  "content":"Example Post"
                }
            }
        */
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
    /* 
            #swagger.tags = ["Post"]
            #swagger.summary = "Delete Single Post"
        */
    const data = await Post.deleteOne({ _id: req.params.id });

    res.status(data.deletedCount ? 204 : 404).send({
      error: !data.deletedCount,
      data,
    });
  },
};
