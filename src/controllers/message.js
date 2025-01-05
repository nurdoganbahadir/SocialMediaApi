"use strict";

const Message = require("../models/message");
const Conversation = require("../models/conversation");
const Notification = require("../models/notification");

module.exports = {
  sendMessage: async (req, res) => {
    /* 
            #swagger.tags = ["Message"]
            #swagger.summary = "Create Message"
            #swagger.description = "If a person creates a new conversation, a conversation database will be created."
            #swagger.parameters['body'] = {
                in:'body',
                required:true,
                schema:{
                  "receiverId": "676b19c7af816bcb25dfc2cc",
                  "message": "message content"
                }
            }
        */
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
    /* 
           #swagger.tags = ["Conversation"]
           #swagger.summary = "Get Single Conversation"
           #swagger.description = "http://127.0.0.1:8000/message/conversation/67768eba057952786db14e89"
        */
    const { conversationId } = req.params;

    const messages = await Message.find({ conversationId })
      .populate("senderId", "username profileImage")
      .populate("receiverId", "username profileImage");

    res.status(200).send({
      error: false,
      data: messages,
    });
  },

  getConversation: async (req, res) => {
    /* 
           #swagger.tags = ["Conversation"]
           #swagger.summary = "Get Single Conversation Details"
           #swagger.description = "http://127.0.0.1:8000/message/conversation/67768eba057952786db14e89/details -- The relationships of the conversation in the details section are seen."
        */
    const { conversationId } = req.params;

    const conversation = await Conversation.findById(conversationId);

    res.status(200).send({
      error: false,
      data: conversation,
    });
  },
};
