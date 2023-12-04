import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
const userValidation = async(req,res)=>{
    try{
        const user = await userModel.findOne({email : req.body.useremail});
        console.log(user);
        if(user===null || user.length === 0)
        {
            res.status(404).json({loginResponse:"User with email don't exist"});
        }
        else{
            if(await bcrypt.compare(req.body.password,user.password))
            {
                res.status(200).json({loginResponse:"Successfull login"});
            }
            else{
                res.status(401).json({loginResponse:"Incorrect password!"});
            }
        }
    }
    catch(error)
    {
        res.status(500).json({loginResponse:"Internal server error!"});
    }
}
export default userValidation;