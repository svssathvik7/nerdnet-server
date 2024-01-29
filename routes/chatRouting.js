const express = require("express");
const Router = express.Router();
const {getChat} = require("../controllers/chatController");
const {addMessage} = require("../controllers/chatController");
const {addChatReaction} = require("../controllers/chatController");
Router.post("/get-chat",getChat);
Router.post("/add-message",addMessage);
Router.post("/chat-reaction",addChatReaction);
module.exports = Router;