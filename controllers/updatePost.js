const postDb = require("../models/postModel");
const commentDb = require("../models/commentModel");
const userDb = require("../models/userModel");
const debugLog = require("../server");
const {getSession} = require("../db/dataBase");
const addComment = async (req, res) => {
    try {
        const postId = req.body.postId;
        const commentText = req.body.comment;
        const userEmail = req.body.user;

        const postMatch = await postDb.findOne({ _id: postId });
        const userMatch = await userDb.findOne({ email: userEmail });

        if (postMatch && userMatch) {
            const session = await getSession();
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
        console.log(error);
        res.status(500).json({ commentUpdate: "Something went wrong!", status: false });
    }
};

const changeLikes = async (req,res)=>{
    try{
        const {postId,addLike,userLiked} = req.body;
        const postMatch = await postDb.findOne({_id:postId});
        const userMatch = await userDb.findById(userLiked);
        if(postMatch && userMatch){
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
                var postTagsAll = postMatch.tags.concat(userMatch.interestsHistory);
                var uniqueInterests = [...new Set(postTagsAll)];
                const updatedUser = await userDb.findOneAndUpdate({_id:userLiked},{
                    $set : {
                        interestsHistory : uniqueInterests
                    }
                });
                console.log("tags - ",uniqueInterests);
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
const deletePost = async (req,res)=>{
    try{
        const {postId} = req.body;
        const session = await getSession();
        await session.withTransaction(async()=>{
            const postMatch = await postDb.findById(postId);
            const userMatch = await userDb.findById(postMatch.userPosted);
            if(postMatch && userMatch){
                await postDb.deleteOne({_id:postMatch._id});
                await userMatch.posts.pull(postMatch._id);
                await session.commitTransaction();
                res.status(200).json({message:"Succesfull deletion!",status:true});
            }
            else{
                await session.abortTransaction();
                res.status(404).json({message:"Data inconsistency! Critical Db error!!",status:false});
            }
        })
    }
    catch(error){
        console.log(error);
        await session.abortTransaction();
        res.status(500).json({message:"Something went wrong!",status:false});
    }
}
module.exports = { addComment,changeLikes,deletePost };