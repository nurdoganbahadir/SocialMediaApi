"use strict";

const Message = require("../models/message");
const Conversation = require("../models/conversation");
const Notification = require("../models/notification");

module.exports = {
  sendMessage: async (req, res) => {
    try {
      const { conversationId, receiverId, message } = req.body;

      // Mevcut bir konuşma yoksa yeni bir konuşma oluştur
      let conversation = await Conversation.findOne({
        participants: { $all: [req.user._id, receiverId] },
      });

      if (!conversation) {
        conversation = await Conversation.create({
          participants: [req.user._id, receiverId],
        });
      }

      // Yeni mesaj oluştur
      const newMessage = await Message.create({
        conversationId: conversation._id,
        senderId: req.user._id,
        receiverId,
        message,
      });

      // Bildirim oluştur
      await Notification.create({
        userId: receiverId,
        type: "message",
        message: `${req.user.username}: ${message}`,
      });

      res.status(201).send({
        error: false,
        data: newMessage,
      });
    } catch (error) {
      res.status(500).send({
        error: true,
        message: error.message,
      });
    }
  },

  getMessages: async (req, res) => {
    try {
      const { conversationId } = req.params;

      const messages = await Message.find({ conversationId })
        .populate("senderId", "username profileImage")
        .populate("receiverId", "username profileImage");

      res.status(200).send({
        error: false,
        data: messages,
      });
    } catch (error) {
      res.status(500).send({
        error: true,
        message: error.message,
      });
    }
  },

  getConversation: async (req, res) => {
    try {
      const { conversationId } = req.params;

      const conversation = await Conversation.findById(conversationId);

      res.status(200).send({
        error: false,
        data: conversation,
      });
    } catch (error) {
      res.status(500).send({
        error: true,
        message: error.message,
      });
    }
  },
};
