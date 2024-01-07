const userDb = require("../models/userModel");
const postDb = require("../models/postModel");
const sendAllUsers = async (req,res)=>{
    try{
        const allDbNerds = await userDb.find({});
        res.json({message:"Success",status:true,users:allDbNerds});
    }
    catch(error){
        res.json({message:"Error!",status:false});
    }
}
const sendQueriedUsers = async (req,res)=>{
    const queryString = req.query.q;
    try{
        const regex = new RegExp(`${queryString}`,'i');
        const matchingUsers = await userDb.find({username:regex});
        console.log(matchingUsers);
        res.status(200).json({message:"Successfully retrieved search data",status:true,result:matchingUsers});
    }
    catch(error){
        res.status(500).json({message:"Error retrieving search data!",status:false});
    }
}
const sendTrendingTopics = async (req,res)=>{
    try{
        const trendingTopics = await postDb.aggregate(
            [
                {$unwind : "$tags"},
                {$group : {_id:"$tags",count : {$sum:1}}},
                {$sort : {count:-1}},
                {$limit : 5}
            ]
        );
        res.status(200).json({message:"Successfull retreieval!",status:true,tags:trendingTopics});
    }
    catch(error){
        res.status(500).json({message:"Something went wrong!",status:false});
    }
}
module.exports = {sendAllUsers,sendQueriedUsers,sendTrendingTopics};