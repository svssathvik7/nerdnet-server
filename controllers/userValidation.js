const userModel = require("../models/userModel.js");
const bcrypt = require("bcryptjs");
const db = require("../db/dataBase.js");
const jwt = require("jsonwebtoken");
const debugLog = require("../server.js");
const userValidation = async (req, res) => {
    try {
        const userMatch = await userModel.findOne({ email: req.body.useremail });
        if (userMatch === null || userMatch.length === 0) {
            res.status(404).json({ loginResponse: "User with email don't exist" });
        } else {
            if (await bcrypt.compare(req.body.password, userMatch.password)) {
                const token = jwt.sign({
                    id: userMatch._id,
                    name: userMatch.name,
                    email: userMatch.email,
                }, process.env.JWT_SECRET_KEY, { expiresIn: "30m" });
                
                res.status(200).json({ loginResponse: "Successful login",userToken : token });
            } else {
                res.status(401).json({ loginResponse: "Incorrect password!" });
            }
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ loginResponse: "Internal server error!" });
    }
};

module.exports = userValidation;