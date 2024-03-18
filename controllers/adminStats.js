const userModel = require("../models/userModel");

const getAllUsers = async({socket,data})=>{
    const pageSize = 10;
    const pageNum = data.pageNum;
    const userId = data.userId;
    const userMatch = await userModel.findOne({_id:userId});
    if(userMatch){
        const usersData = await userModel.find({}).skip((pageNum-1)*pageSize).limit(pageSize).select("-password");
        if(usersData){
            return ({message:"Successfull retreival!",status:true,data:usersData});
        }
        else{
            return ({message:"Unsuccessfull retreival!",status:false});
        }
    }
    else{
        return ({message:"UnAuthorized access!",status:false});
    }
}
module.exports = {getAllUsers};