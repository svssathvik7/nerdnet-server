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
module.exports = updateProfile;