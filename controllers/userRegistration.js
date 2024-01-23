const userModel = require("../models/userModel.js");
const bcrypt = require("bcryptjs");
const debugLog = require("../server.js");
const userRegistration = async(req,res)=>{
    try {
            const salt = await bcrypt.genSalt();
            const password = await bcrypt.hash(req.body.password,salt);
            const newUser = new userModel({
                username : req.body.username,
                email : req.body.email,
                password : password,
                dp : req?.body?.dp??"https://i.pinimg.com/736x/b2/54/ea/b254ea1ec256b93c61aecb2aca62e277.jpg",
            });
            await newUser.save();
            res.status(200).json({customResponse:"User has been successfully created!"});
    } catch (error) {
        if (error.code === 11000 ) {
            return res.status(400).json({ customResponse: "User with Email/Username already exists", error: error });
        }
        else{
            debugLog(error);
            res.status(500).json({ customResponse: "Error while saving user!", error:error });
        }
    }
}
module.exports = userRegistration;