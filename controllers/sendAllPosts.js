const postDb = require("../models/postModel");
const sendAllPosts = async ()=>{
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
    return ({message:"Sending all posts",status:true,data:posts});
}
module.exports = sendAllPosts;