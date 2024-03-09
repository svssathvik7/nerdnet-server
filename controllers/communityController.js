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
                    dateCreated : Date.now()
                }
            );
            await newCommunity.save();
            await userModel.findOneAndUpdate({_id:data.user},{
                $push : { spaces : newCommunity._id}
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
const getCommunityInfo = async(req,res)=>{
    const {id} = req.body;
    try {
        const community_match = await communityModel.findOne({_id:id});
        if(community_match){
            res.status(200).json({message:"Community found",status:true,community_info:community_match});
        }
        else{
            res.status(401).json({message:"Community not found!",status:false});
        }
    } catch (error) {
        res.status(500).json({message:"Something went wrong!",status:false});
    }
}
module.exports = {createCommunity,getCommunityInfo};