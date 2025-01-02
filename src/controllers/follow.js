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
    const newFollow = await Follow.create({
      followingId: req.user._id,
      followerId: req.body.followerId,
    });

    const { username, profileImage } = await User.findOne({
      _id: req.body.followerId,
    });

    await User.updateOne(
      { _id: req.body.followerId },
      {
        $push: {
          followers: {
            userId: req.user._id,
            username: req.user.username,
            profileImage: req.user?.profileImage,
          },
        },
      }
    );

    await User.updateOne(
      { _id: req.user._id },
      {
        $push: {
          following: {
            userId: req.body.followerId,
            username: username,
            profileImage: profileImage,
          },
        },
      }
    );

    res.status(201).send({
      error: false,
      data: newFollow,
    });
  },

  read: async (req, res) => {
    const data = await Follow.findOne({ _id: req.params.id });

    res.status(200).send({
      error: false,
      data,
    });
  },

  update: async (req, res) => {
    const data = await Follow.updateOne({ _id: req.params.id }, req.body, {
      runValidators: true,
    });

    res.status(202).send({
      error: false,
      data,
    });
  },

  delete: async (req, res) => {
    try {
      const { followerId } = req.body;

      // Follow kaydını sil
      const follow = await Follow.findOneAndDelete({
        followingId: req.user._id,
        followerId,
      });

      if (!follow) {
        return res.status(404).send({
          error: true,
          message: "Follow record not found",
        });
      }

      // Takip eden kullanıcının following listesinden çıkar
      await User.updateOne(
        { _id: req.user._id },
        {
          $pull: {
            following: { userId: followerId },
          },
        }
      );

      // Takip edilen kullanıcının followers listesinden çıkar
      await User.updateOne(
        { _id: followerId },
        {
          $pull: {
            followers: { userId: req.user._id },
          },
        }
      );

      res.status(204).send({
        error: false,
        message: "Unfollow successful",
      });
    } catch (error) {
      res.status(500).send({
        error: true,
        message: error.message,
      });
    }
  },
};
