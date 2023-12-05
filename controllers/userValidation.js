const userModel = require("../models/userModel.js");
const bcrypt = require("bcrypt");
const db = require("../db/dataBase.js");
const userValidation = async (req, res) => {
    console.log(req.session.id);
    try {
        const user = await userModel.findOne({ email: req.body.useremail });
        if (user === null || user.length === 0) {
            req.session.isAuthenticated = false;
            res.status(404).json({ loginResponse: "User with email don't exist" });
        } else {
            if (await bcrypt.compare(req.body.password, user.password)) {
                req.session.isAuthenticated = true;
                res.status(200).json({ loginResponse: "Successful login" });
            } else {
                req.session.isAuthenticated = false;
                res.status(401).json({ loginResponse: "Incorrect password!" });
            }
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ loginResponse: "Internal server error!" });
    }
};

module.exports = userValidation;
