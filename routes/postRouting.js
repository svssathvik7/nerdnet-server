const express = require("express");
const router = express.Router();
const postModel = require("../models/postModel");
const addNewPost = require("../controllers/addNewPost");
router.post("/newPost",addNewPost);
router.get("/getAllPosts",async (req,res)=>{
    const posts = await postModel.find({});
    res.json(posts);
})

module.exports = router;