const express = require("express");
const {addAdminController,getPendingInvites} = require("../controllers/adminController");
const Router = express.Router();

Router.post("/add-admins",addAdminController);
Router.post("/get-pending-invites",getPendingInvites);
module.exports = Router;