const postDb = require("../models/postModel");
const commentDb = require("../models/commentModel");
const userDb = require("../models/userModel");
const debugLog = require("../server");
const {session} = require("../db/dataBase");
const addComment = async (req, res) => {
    try {
        const postId = req.body.postId;
        const commentText = req.body.comment;
        const userEmail = req.body.user;

        const postMatch = await postDb.findOne({ _id: postId });
        const userMatch = await userDb.findOne({ email: userEmail });

        if (postMatch && userMatch) {
            await session.withTransaction(async ()=>{
                const newComment = new commentDb({
                    post: postMatch._id,
                    commentedUser: userMatch._id,
                    data: commentText,
                });
                await newComment.save();
                await postDb.updateOne(
                    { _id: postMatch._id },
                    { $push: { comments: newComment._id } }
                );
                res.status(200).json({ commentUpdate: "Successfully added comment!", status: true });
            }).catch(error=>{
                throw error;
            })

        } else {
            res.status(404).json({ commentUpdate: "Post or user not found!", status: false });
        }
    } catch (error) {
        debugLog(error);
        res.status(500).json({ commentUpdate: "Something went wrong!", status: false });
    }
};

const changeLikes = async (req,res)=>{
    try{
        const {postId,addLike,userLiked} = req.body;
        const postMatch = await postDb.findOne({_id:postId});
        if(postMatch){
            if(addLike){
                const alreadyExists = await postMatch.likes.some(like => like?._id === userLiked?._id);
                if(!alreadyExists){
                    var postUpdated = await postDb.updateOne(
                        { _id: postId },
                        { $addToSet: { likes: userLiked } },
                        );                
                    }
                    else{
                    res.json({message:"Error updating",status:false});
                }
                var postUpdated = await postDb.updateOne(
                    { _id: postId },
                    { $pull: { dislikes: userLiked } }
                );    
            }
            else{
                const alreadyExists = await postMatch.dislikes.some(dislike => dislike?._id === userLiked?._id);
                if(!alreadyExists){
                    var postUpdated = await postDb.updateOne(
                        { _id: postId },
                        { $addToSet: { dislikes: userLiked } },
                    );                
                }
                else{
                    res.json({message:"Error updating",status:false});
                }
                var postUpdated = await postDb.updateOne(
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
