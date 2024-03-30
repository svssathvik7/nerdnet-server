const userDb = require("../models/userModel");
const postDb = require("../models/postModel");
const { communityModel } = require("../models/communityModel");
const userModel = require("../models/userModel");
const debugLog = require("debug")("app:debugLog");
const sendTrendingNerds = async (req,res)=>{
    try{
        const sortedTrendingNerds = await userDb.aggregate(
            [
                {
                    $project : {
                        username : 1,
                        email : 1,
                        followersCount : {$size:"$followers"}
                    }
                },
                {
                    $sort : {
                        followersCount : -1
                    }
                },
                {
                    $limit : 5
                }
            ]
        );
        return ({message:"Success",status:true,nerds:sortedTrendingNerds});
    }
    catch(error){
        return ({message:"Error!",status:false});
    }
}
const searchQueryResponse = async (req,res)=>{
    const queryString = req.query.q;
    const postQuery = req.query.p;
    if(queryString){
        try{
            const regex = new RegExp(`${queryString}`,'i');
            const matchingUsers = await userDb.find({username:regex});
            const matchingCommunities = await communityModel.find({name:regex});
            res.status(200).json({message:"Successfully retrieved search data",status:true,usersresult:matchingUsers,communityresult:matchingCommunities});
        }
        catch(error){
            res.status(500).json({message:"Error retrieving search data!",status:false});
        }
    }
    else{
        try {
            const matchingPosts = await postDb.aggregate([
                {$match : {'tags' : {$in : [postQuery]}}}
            ]);
            const updatedMatchPosts = await postDb.populate(matchingPosts,[
                {
                    path: 'userPosted',
                },
                {
                    path: 'comments',
                    populate: {
                        path: 'commentedUser',
                        select : '-password'
                    },
                },
                {
                    path : 'likes dislikes'
                }
            ]);
            res.status(200).json({message:"Succesfully retreived data",status:true,posts:updatedMatchPosts});
        } catch (error) {
            console.log(error);
            res.status(500).json({message:"Error retreiving search data!",status:false});
        }
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
        return ({message:"Successfull retreival!",status:true,tags:trendingTopics});
    }
    catch(error){
        return ({message:"Something went wrong!",status:false});
    }
}
const sendTrendingPosts = async (req,res)=>{
    try{
        const trendingPosts = await postDb.aggregate(
            [
                {$sort : {"likes":-1}},
                {$limit:3},
                {$project : {postData:1,_id:1,caption:1}}
            ]
        );
        return ({message:"Successfull retreival!",status:true,posts:trendingPosts});
    }
    catch(error){
        console.log(error);
        return ({message:"Something went wrong!",status:false});
    }
}
const getPostById = async (req,res)=>{
    try {
        const postId = req.query.postId;
        const post = await postDb.findById(postId).populate([
            {
                path: 'userPosted',
            },
            {
                path: 'comments',
                populate: {
                    path: 'commentedUser',
                    select : '-password'
                },
            },
            {
                path : 'likes dislikes'
            }
        ]);
        res.status(200).json({message:"Succuessfull response",status:true,post:post});
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Something went wrong!",status:false});
    }
}
const getMySpaces = async ({socket,data})=>{
    const user = data.user;
    try {
       const userMatch = await userModel.findOne({_id:user}).populate("spaces");
       if(userMatch)
       {
        return ({message:"Successfull space retreival!",status:true,spaces:userMatch.spaces});
       }
       else{
        return ({message:"Failed to get user!",status:false});
       } 
    } catch (error) {
        console.log(error);
        return ({message:"Something went wrong!",status:false});
    }
}
const getUserInformation = async({socket,data})=>{
    const user = data.user;
    try {
        const userMatch = await userDb.findOne({_id:user}).populate([
            {
                path : 'posts followers following savedPosts',
                select : '-password',
            },
            {
                path : 'posts',
                populate : {
                    path : 'comments',
                    populate : {
                        path : 'commentedUser',
                        select : '-password'
                    }
                }
            },
            {
                path : 'posts',
                populate : {
                    path : 'likes dislikes'
                }
            }
        ]).exec();
        if(userMatch){
            return ({message:"Successfull retreival!",status:true,user:userMatch});
        }
        else{
            return ({message:"User not found!",status:false});
        }
    } catch (error) {
        console.log(error);
        return ({message:"Something went wrong!",status:false});
    }
}
const getUserHomeFeed = async (req, res) => {
    const { user, pageNum } = req.body;
    const pageSize = 5;
    try {
      // Fetch posts by users followed by the current user
      const userMatch = await userDb.findById(user);
      const totalPosts = await postDb.countDocuments({userPosted : {$in : userMatch?.following}});
      if(!userMatch){
        return res.status(401).json({message:"No user found!",status:false});
      }
      const followingPosts = await postDb.find({ userPosted: { $in: userMatch.following } })
        .limit(pageSize)
        .skip((pageNum - 1) * pageSize)
        .populate(
            [
                {
                    path : "userPosted likes comments dislikes"
                },
                {
                    path : "comments",
                    populate : {
                        path : "commentedUser",
                        select: "-password"
                    }
                }
            ]
        )
        .exec();
        // console.log(pageNum,"-pagenum-len-",followingPosts?.length);
      res.status(200).json({message:"Successfull retreival",status:true,posts:followingPosts,totalNumPosts:totalPosts});
    } catch (error) {
      console.error("Error fetching user home feed:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };  
module.exports = {sendTrendingNerds,searchQueryResponse,sendTrendingTopics,sendTrendingPosts,getPostById,getMySpaces,getUserInformation,getUserHomeFeed};