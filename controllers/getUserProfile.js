const userDb = require("../models/userModel");
const debugLog = require("../server");
const getUserProfile = async ({socket,data})=>{
    const check = async (userMatch,reqUserMatch)=>{
        const follList = userMatch.followers;
        return follList.some(foll => (foll._id).equals(reqUserMatch._id));
    }
    try{
        const targetEmail = data.profileEmail;
        const requestingEmail = data.requestEmail;
        const userMatch = await userDb.findOne({email:targetEmail}).populate([
            {
                path : 'posts followers following savedPosts spaces',
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
        const reqUserMatch = await userDb.findOne({email:requestingEmail});
        if(userMatch && reqUserMatch)
        {
            const userProfileData = {
                _id : userMatch._id,
                dp : userMatch.dp,
                username : userMatch.username,
                email : userMatch.email,
                education : userMatch.education,
                posts : userMatch.posts,
                isfollowing : await check(userMatch,reqUserMatch),
                followers : userMatch.followers,
                following : userMatch.following,
                savedPosts : userMatch.savedPosts,
                spaces : userMatch.spaces
            }
            return ({profileResponse:"User details sent!",userProfile:userProfileData});
        }
        else{
            return ({profileResponse:"User do not exist",userProfile:false});
        }
    }
    catch(error){
        console.log(error);
        return ({profileResponse:"Error sending profile",userProfile:false});
    }
}
module.exports = getUserProfile;