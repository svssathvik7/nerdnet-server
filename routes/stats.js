const express = require("express");
const router = express.Router();
const {sendAllUsers} = require("../controllers/statistics");
const {sendQueriedUsers} = require("../controllers/statistics");
const {sendTrendingTopics} = require("../controllers/statistics");
router.get("/getAllUserDetails/",sendAllUsers);
router.get("/search/",sendQueriedUsers);
router.get("/getTrendingTopics/",sendTrendingTopics);
module.exports = router;