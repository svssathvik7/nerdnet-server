const postDb = require("../models/postModel");
const sendAllPosts = async (req,res)=>{
    const posts = await postDb.find({}).populate("userPosted");
    res.json(posts);
}
module.exports = sendAllPosts;