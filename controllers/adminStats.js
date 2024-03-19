const userModel = require("../models/userModel");
const postModel = require("../models/postModel");
const {communityModel} = require("../models/communityModel");
const commentModel = require("../models/commentModel");
const getAllUsers = async({socket,data})=>{
    const pageSize = 6;
    const pageNum = data.pageNum;
    const userId = data.userId;
    const userMatch = await userModel.findOne({_id:userId});
    const totalUsers = await userModel.countDocuments({});
    const pageLimit = Math.ceil(totalUsers/pageSize);
    if(userMatch){
        const usersData = await userModel.find({}).skip((pageNum-1)*pageSize).limit(pageSize).select("-password");
        if(usersData){
            return ({message:"Successfull retreival!",status:true,data:usersData,pageLimit:pageLimit});
        }
        else{
            return ({message:"Unsuccessfull retreival!",status:false});
        }
    }
    else{
        return ({message:"UnAuthorized access!",status:false});
    }
}
const SendStatistics = async({socket,data})=>{
    try {
        const userId = data.userId;
        const userMatch = await userModel.findOne({_id:userId});
        if(userMatch){
            const totalNerds = await userModel.countDocuments({});
            const totalAdmins = await userModel.countDocuments({isAdmin : true});
            const totalPosts = await postModel.countDocuments({});
            const totalCommunities = await communityModel.countDocuments({});
            const comments = await commentModel.countDocuments({});
            const stats = {
                totalNerds : totalNerds,
                totalAdmins : totalAdmins,
                totalPosts : totalPosts,
                totalCommunities : totalCommunities,
                totalComments : comments
            }
            return ({message:"Successfully fetched stats",status:true,stats:stats});
        }
        else{
            return ({message:"Not an admin!",status:false});
        }
    } catch (error) {
        return ({message:"Something went wrong!",status:false});
    }
}
module.exports = {getAllUsers,SendStatistics};