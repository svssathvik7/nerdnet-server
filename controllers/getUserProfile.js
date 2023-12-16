const userDb = require("../models/userModel");
const getUserProfile = async (req,res)=>{
    try{
        const targetEmail = req.body.profileEmail;
        const requestingEmail = req.body.requestEmail;
        const userMatch = await userDb.findOne({email:targetEmail}).populate("posts");
        const reqUserMatch = await userDb.findOne({email:requestingEmail});
        if(userMatch && reqUserMatch)
        {
            const userProfileData = {
                dp : userMatch.dp,
                username : userMatch.username,
                email : userMatch.email,
                education : userMatch.education,
                posts : userMatch.posts,
                isfollowing : userMatch.followers.includes(reqUserMatch._id),
                followers : userMatch.followers,
                following : userMatch.following
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