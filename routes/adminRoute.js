const express = require("express");
const {addAdminController} = require("../controllers/adminController");
const Router = express.Router();

Router.post("/add-admins",addAdminController);
module.exports = Router;