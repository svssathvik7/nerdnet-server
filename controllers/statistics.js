const userDb = require("../models/userModel");
const postDb = require("../models/postModel");
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
        res.json({message:"Success",status:true,nerds:sortedTrendingNerds});
    }
    catch(error){
        res.json({message:"Error!",status:false});
    }
}
const searchQueryResponse = async (req,res)=>{
    const queryString = req.query.q;
    const postQuery = req.query.p;
    if(queryString){
        try{
            const regex = new RegExp(`${queryString}`,'i');
            const matchingUsers = await userDb.find({username:regex});
            res.status(200).json({message:"Successfully retrieved search data",status:true,result:matchingUsers});
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
            debugLog(updatedMatchPosts);
            res.status(200).json({message:"Succesfully retreived data",status:true,posts:updatedMatchPosts});
        } catch (error) {
            debugLog(error);
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
        res.status(200).json({message:"Successfull retreival!",status:true,tags:trendingTopics});
    }
    catch(error){
        res.status(500).json({message:"Something went wrong!",status:false});
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
        res.status(200).json({message:"Successfull retreival!",status:true,posts:trendingPosts});
    }
    catch(error){
        debugLog(error);
        res.status(500).json({message:"Something went wrong!",status:false});
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
        debugLog(error);
        res.status(500).json({message:"Something went wrong!",status:false});
    }
}
module.exports = {sendTrendingNerds,searchQueryResponse,sendTrendingTopics,sendTrendingPosts,getPostById};