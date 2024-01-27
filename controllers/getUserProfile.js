const userDb = require("../models/userModel");
const debugLog = require("../server");
const getUserProfile = async (req,res)=>{
    const check = async (userMatch,reqUserMatch)=>{
        const follList = userMatch.followers;
        return follList.some(foll => (foll._id).equals(reqUserMatch._id));
    }
    try{
        const targetEmail = req.body.profileEmail;
        const requestingEmail = req.body.requestEmail;
        const userMatch = await userDb.findOne({email:targetEmail}).populate([
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
            },
            // {
            //     path : 'savePosts',
            //     populate : {
            //         path : 'likes dislikes'
            //     }
            // },
            // {
            //     path : 'savedPosts',
            //     populate : {
            //         path : 'comments',
            //         populate : {
            //             path : 'commentedUser',
            //             select : '-password'
            //         }
            //     }
            // },
            // {
            //     path : 'savedPosts',
            //     populate : {
            //         path : 'userPosted'
            //     }
            // }
        ]).exec();
        const reqUserMatch = await userDb.findOne({email:requestingEmail});
        if(userMatch && reqUserMatch)
        {
            const userProfileData = {
                dp : userMatch.dp,
                username : userMatch.username,
                email : userMatch.email,
                education : userMatch.education,
                posts : userMatch.posts,
                isfollowing : await check(userMatch,reqUserMatch),
                followers : userMatch.followers,
                following : userMatch.following,
                savedPosts : userMatch.savedPosts
            }
            res.status(200).json({profileResponse:"User details sent!",userProfile:userProfileData});
        }
        else{
            res.status(401).json({profileResponse:"User do not exist",userProfile:false});
        }
    }
    catch(error){
        console.log(error);
        res.status(500).json({profileResponse:"Error sending profile",userProfile:false});
    }
}
module.exports = getUserProfile;