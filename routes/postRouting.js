const express = require("express");
const router = express.Router();
const sendAllPosts = require("../controllers/sendAllPosts");
const addNewPost = require("../controllers/addNewPost");
router.post("/newPost",addNewPost);
router.get("/getAllPosts",sendAllPosts);

module.exports = router;