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
const getPendingInvites = async(req,res)=>{
    const pageSize = 5;
    const {pageNum} = req.body;
    try {
        const totalPages = await userModel.countDocuments({isAdmin:"pending"});
        const pendingUsers = await userModel.find({isAdmin:"pending"}).skip((pageNum-1)*pageNum).limit(pageSize);
        res.status(200).json({message:"Successfull retreival",status:true,pending_invites:pendingUsers,total_pages:totalPages});
    } catch (error) {
        res.status(500).json({message:"Something went wrong!",status:false});
    }
}
module.exports = {addAdminController,getPendingInvites};