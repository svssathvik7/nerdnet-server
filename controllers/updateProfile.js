const userDb = require("../models/userModel");
const debugLog = require("../server");
const postDb = require("../models/postModel");
const { communityModel } = require("../models/communityModel");
const updateProfile = async (req,res)=>{
    try{
        const targetMail = req.body.email;
        const userMatch = await userDb.findOne({email:targetMail});
        if(userMatch){
            const updatedUser = await userDb.updateOne(
                {email:targetMail},
                {
                    username : req.body.username,
                    education : req.body.education,
                    dp : req.body.dp
                }
            );
            res.status(200).json({ updateResponse: "Successfully updated", status: true });
        }
        else{
            res.status(401).json({updateResponse:"Critical security alert!",status:false});
        }
    }
    catch(error){
        debugLog(error);
        res.status(500).json({updateResponse:"Something went wrong!",status:false});
    }
}
const updateFollower = async (req,res)=>{
    const master = req.body.masterAcc;
    const follower = req.body.followerAcc;
    const isFollowing = req.body.isFollowing;
    try{
        const masterUser = await userDb.findOne({email:master});
        const followerUser = await userDb.findOne({email:follower});
        if(masterUser && followerUser){
            if(!isFollowing){
                const result1 = await userDb.updateOne({email:master},{
                    $push : {followers : followerUser}
                });
                const result2 = await userDb.updateOne({email:follower},{
                    $push : {
                        following : masterUser
                    }
                });
            }
            else{
                const result1 = await userDb.updateOne({email:master},{
                    $pull : {followers : followerUser._id}
                });
                const result2 = await userDb.updateOne({email:follower},{
                    $pull : {
                        following : masterUser._id
                    }
                });
            }
            res.status(200).json({ updateProfile: "Update successful!", status: true });
        }
        else{
            res.status(401).json({updateProfile:"User not found!",status:false});
        }
    }
    catch(error){
        debugLog(error);
        res.status(500).json({updateProfile:"Something went wrong!",status:false});
    }
}
const alterSavedPost = async (req,res)=>{
    try{
        const {userId,postId,operation} = req.body;
        const userMatch = await userDb.findById(userId);
        const postMatch = await postDb.findById(postId);
        if(userMatch && postMatch){
            if(operation==="add")
            {
                await userMatch.savedPosts.push(postMatch._id);
                await userMatch.save();
            }
            else{
                await userMatch.savedPosts.pull(postMatch._id);
                await userMatch.save();
            }
            res.status(200).json({message:"Successfull update!",status:true});
        }
        else{
            res.status(401).json({message:"Critical db inconsistency!",status:false});
        }
    }
    catch(error){
        console.log(error);
        res.status(500).json({message:"Something went wrong!!",status:false});
    }
}
const updateUserSpaces = async(req,res)=>{
    try {
        const {user} = req.body;
        const {space} = req.body;
        const userMatch = await userDb.findById(user);
        const spaceMatch = await communityModel.findById(space);
        if(userMatch && spaceMatch){
            const hasAlreadySubs = await spaceMatch.followers.includes(userMatch._id);
            if(hasAlreadySubs){
                throw Error("Already following!");
            }
            else{
                await userDb.findOneAndUpdate({_id:userMatch._id},{
                    $push : {
                        spaces : spaceMatch._id
                    }
                });
                await communityModel.findOneAndUpdate({_id:spaceMatch._id},{
                    $push : {
                        followers : userMatch._id
                    }
                });
                res.status(200).json({message:"Successfull subsctiption",status:true});
            }
        }
        else{
            res.status(401).json({message:"Critical db inconsistency!",status:false});
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Something went wrong!!",status:false});
    }
}
module.exports = {updateProfile,updateFollower,alterSavedPost,updateUserSpaces};