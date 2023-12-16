const userDb = require("../models/userModel");
const updateProfile = async (req,res)=>{
    try{
        const targetMail = req.body.email;
        const userMatch = await userDb.findOne({email:targetMail});
        if(userMatch){
            const updatedUser = await userDb.updateOne(
                {email:targetMail},
                {
                    username : req.body.username,
                    education : req.body.education,
                    dp : req.body.dp
                }
            );
            res.status(200).json({ updateResponse: "Successfully updated", status: true });
        }
        else{
            res.status(401).json({updateResponse:"Critical security alert!",status:false});
        }
    }
    catch(error){
        console.log(error);
        res.status(500).json({updateResponse:"Something went wrong!",status:false});
    }
}
const updateFollower = async (req,res)=>{
    const master = req.body.masterAcc;
    const follower = req.body.followerAcc;
    try{
        const masterUser = await userDb.findOne({email:master});
        const followerUser = await userDb.findOne({email:follower});
        if(masterUser && followerUser){
            const result1 = await userDb.updateOne({email:master},{
                $push : {followers : followerUser}
            });
            const result2 = await userDb.updateOne({email:follower},{
                $push : {
                    following : masterUser
                }
            });
            res.status(200).json({ updateProfile: "Update successful!", status: true });
        }
        else{
            res.status(401).json({updateProfile:"User not found!",status:false});
        }
    }
    catch(error){
        console.log(error);
        res.status(500).json({updateProfile:"Something went wrong!",status:false});
    }
}
module.exports = {updateProfile,updateFollower};