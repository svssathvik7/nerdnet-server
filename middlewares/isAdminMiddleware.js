const userModel = require("../models/userModel");

const isAdmin = async(req,res,next)=>{
    const {admin} = req.body;
    try {
        const adminMatch = await userModel.findOne({_id:admin});
        if(adminMatch.isAdmin == "true"){
            next();
        }
        else{
            return res.status(401).json({message:"Insufficient previlages!",status:false});
        }
    } catch (error) {
        return res.status(500).json({message:"Something went wrong!",status:false});
    }
}
module.exports = {isAdmin}