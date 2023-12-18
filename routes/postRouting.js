const express = require("express");
const router = express.Router();
const sendAllPosts = require("../controllers/sendAllPosts");
const addNewPost = require("../controllers/addNewPost");
const {addComment} = require("../controllers/updatePost");
router.post("/newPost",addNewPost);
router.get("/getAllPosts",sendAllPosts);
router.post("/addComment",addComment);
module.exports = router;