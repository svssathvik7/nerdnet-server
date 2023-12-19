const postDb = require("../models/postModel");
const commentDb = require("../models/commentModel");
const userDb = require("../models/userModel");
const addComment = async (req, res) => {
    console.log(req.body);
    try {
        const postId = req.body.postId;
        const commentText = req.body.comment;
        const userEmail = req.body.user;

        const postMatch = await postDb.findOne({ _id: postId });
        const userMatch = await userDb.findOne({ email: userEmail });

        if (postMatch && userMatch) {
            const newComment = new commentDb({
                post: postMatch._id,
                commentedUser: userMatch._id,
                data: commentText,
            });

            await newComment.save();

            const update = await postDb.updateOne(
                { _id: postMatch._id },
                { $push: { comments: newComment._id } }
            );

            res.status(200).json({ commentUpdate: "Successfully added comment!", status: true });
        } else {
            res.status(404).json({ commentUpdate: "Post or user not found!", status: false });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ commentUpdate: "Something went wrong!", status: false });
    }
};

const changeLikes = async (req,res)=>{
    try{
        const {postId,addLike,userLiked} = req.body;
        console.log(req.body);
        const postMatch = await postDb.findOne({_id:postId});
        if(postMatch){
            if(addLike){
                const postUpdated = await postDb.updateOne(
                    { _id: postId },
                    { $push: { likes: userLiked } }
                );                
            }
            else{
                const postUpdated = await postDb.updateOne(
                    { _id: postId },
                    { $pull: { likes: userLiked } }
                );                
            }
            res.json({message:"Success!",status:true});
        }
        else{
            res.json({message:"Error updating",status:false});
        }
    }
    catch(error){
        res.json({message:"Error updating",status:false});
    }
}
module.exports = { addComment,changeLikes };
