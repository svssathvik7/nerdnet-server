const postDb = require("../models/postModel");
const sendAllPosts = async (req,res)=>{
    const posts = await postDb.find({}).populate([
        {
          path: 'userPosted',
        },
        {
          path: 'comments',
          populate: {
            path: 'commentedUser',
            select : '-password'
          },
        },
        {
          path : 'likes dislikes'
        }
      ]);
    res.json(posts);
}
module.exports = sendAllPosts;