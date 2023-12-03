import userModel from "../models/userModel.js";
const userRegistration = async(req,res)=>{
    try {
        const newUser = new userModel(req.body);
        await newUser.save();
        res.status(200).json({customResponse:"User has been successfully created!"});
    } catch (error) {
        if (error.code === 11000 || error.keyPattern.email) {
            return res.status(400).json({ customResponse: "Duplicate email address", error: error });
        }
    
        res.status(500).json({ customResponse: "Error while saving user!", error });
    }
}
export default userRegistration;