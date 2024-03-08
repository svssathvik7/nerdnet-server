const { communityModel } = require("../models/communityModel");

const createCommunity = async(req,res)=>{
    try {
        const data = req.body;
        console.log(data);
        const newCommunity = await new communityModel(
            {
                name : data.community_name,
                dp : data.community_dp,
                coverPic : data.community_cover_pic,
                subject : data.subject,
                description : data.description,
            }
        );
        await newCommunity.save();
        res.status(200).json({message:"Added new community!",status:true});
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Something went wrong!",status:false});
    }
}
const getCommunityInfo = async(req,res)=>{
    const {name} = req.body;
    try {
        const community_match = await communityModel.findOne({name:name});
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