const express = require("express");
const {addAdminController,getPendingInvites,respondPendingInvite} = require("../controllers/adminController");
const Router = express.Router();

Router.post("/add-admins",addAdminController);
Router.post("/get-pending-invites",getPendingInvites);
Router.post("/respond-admin-invite",respondPendingInvite);
module.exports = Router;