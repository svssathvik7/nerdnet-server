const { communityModel } = require("../models/communityModel");
const userModel = require("../models/userModel");

const createCommunity = async(req,res)=>{
    try {
        const data = req.body;
        const userMatch = await userModel.findOne({_id:data.user});
        if(userMatch)
        {
            const newCommunity = await new communityModel(
                {
                    name : data.community_name,
                    dp : data.community_dp,
                    coverPic : data.community_cover_pic,
                    subject : data.subject,
                    description : data.description,
                    createdBy : data.user,
                    dateCreated : Date.now(),
                    followers : [data.user]
                }
            );
            await newCommunity.save();
            await userModel.findOneAndUpdate({_id:data.user},{
                $push : { 
                    spaces : newCommunity._id
                }
            });
            res.status(200).json({message:"Added new community!",status:true,result:newCommunity._id});
        }
        else{
            res.status(401).json({message:"User not found!",status:false});
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Something went wrong!",status:false});
    }
}
const getCommunityInfo = async({socket,data})=>{
    console.log(data)
    try {
        const community_match = await communityModel.findOne({_id:data.id}).populate([
            {
                path : "posts",
                populate : {
                    path : "userPosted likes dislikes comments"
                }
            },
            {
                path : "posts",
                populate : {
                    path : "comments",
                    populate : {
                        path : "commentedUser",
                        select : "-password"
                    }
                }
            }
        ]);
        if(community_match){
            return ({message:"Community found",status:true,community_info:community_match});
        }
        else{
            return ("set-community-info",{message:"Community not found!",status:false});
        }
    } catch (error) {
        return ("set-community-info",{message:"Something went wrong!",status:false});
    }
}
module.exports = {createCommunity,getCommunityInfo};