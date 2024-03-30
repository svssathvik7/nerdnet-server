const userModel = require("../models/userModel");

const addAdminController = async (req,res)=>{
    const {receiver_mail} = req.body;
    try {
        const updatedPrevilage = await userModel.findOneAndUpdate({email:receiver_mail},
            {
                $set : {
                    isAdmin : "pending"
                }
            });
        if(updatedPrevilage){
            await updatedPrevilage.save();
            res.status(200).json({message:"Successfull invite to admin",status:true});
        }
        else{
            res.status(401).json({message:"User not found!",status:false});
        }
    } catch (error) {
        res.status(500).json({message:"Something went wrong!",status:false});
    }
}
module.exports = {addAdminController};