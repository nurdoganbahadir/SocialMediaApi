"use strict";

const { BadRequestError } = require("../errors/customError");
const sendMail = require("../helpers/sendMail");
const User = require("../models/user");

module.exports = {
  list: async (req, res) => {
    /* 
            #swagger.tags = ["User"]
            #swagger.summary = "List User"]"
            #swagger.description = `
                You can send query with endpoint for search[], sort[], page and limit.
                <ul> Examples:
                    <li>URL/?<b>search[field1]=value1&search[field2]=value2</b></li>
                    <li>URL/?<b>sort[field1]=1&sort[field2]=-1</b></li>
                    <li>URL/?<b>page=2&limit=1</b></li>
                </ul>
            `
        */
    const data = await res.getModelList(User);

    res.status(200).send({
      error: false,
      details: await res.getModelListDetails(User),
      data,
    });
  },
  create: async (req, res) => {
    /* 
            #swagger.tags = ["User"]
            #swagger.summary = "Create User"
            #swagger.parameters['body'] = {
                in:'body',
                required:true,
                schema:{
                  "username":"test01",
                  "password":"Test123?",
                  "email":"test@gmail.com",
                  "bio":"example bio description",
                  "birthdate":"01-01-2000",
                  "profileImage":"profile image url"
                }
            }
        */
    if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(
        req?.body?.password
      )
    )
      throw new BadRequestError(
        "Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character."
      );

    const data = await User.create(req.body);

    sendMail(
      data.email,
      "Welcome to our system",
      `
      <h1>Welcome</h1>
      <h2>${data.username}</h2>
      <p>New post added.</p>
      `
    );

    res.status(201).send({
      error: false,
      data,
    });
  },
  
  read: async (req, res) => {
    /* 
           #swagger.tags = ["User"]
           #swagger.summary = "Get Single User"
        */
    const data = await User.findOne({ _id: req.params.id });

    res.status(200).send({
      error: false,
      data,
    });
  },
  update: async (req, res) => {
    /* 
            #swagger.tags = ["User"]
            #swagger.summary = "Update User"
            #swagger.parameters['body'] = {
                in:'body',
                required:true,
                schema:{
                  "username":"test01",
                  "password":"Test123?",
                  "email":"test@gmail.com",
                  "bio":"example bio description",
                  "birthdate":"01-01-2000",
                  "profileImage":"profile image url"
                }
            }
        */
    if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(
        req?.body?.password
      )
    )
      throw new BadRequestError(
        "Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character."
      );

    const data = await User.updateOne({ _id: req.params.id }, req.body, {
      runValidators: true,
    });

    res.status(200).send({
      error: false,
      data,
      new: await User.findOne({ _id: req.params.id }),
    });
  },
  delete: async (req, res) => {
    /* 
            #swagger.tags = ["User"]
            #swagger.summary = "Delete Single User"
        */
    const data = await User.deleteOne({ _id: req.params.id });

    res.status(data.deletedCount ? 204 : 404).send({
      error: !data.deletedCount,
      data,
    });
  },
};
