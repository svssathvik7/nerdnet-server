const express = require("express");
const Router = express.Router();
const {createCommunity,getCommunityInfo} = require("../controllers/communityController");


Router.post("/create-community",createCommunity);
Router.post("/get-community-info",getCommunityInfo);
module.exports = Router;