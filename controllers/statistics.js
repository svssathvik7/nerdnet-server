const userDb = require("../models/userModel");
const sendAllUsers = async (req,res)=>{
    try{
        const allDbNerds = await userDb.find({});
        res.json({message:"Success",status:true,users:allDbNerds});
    }
    catch(error){
        res.json({message:"Error!",status:false});
    }
}
module.exports = {sendAllUsers};