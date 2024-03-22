const express = require("express");
const Router = express.Router();
const {getUserPreferences} = require("../controllers/UserPreferences");


Router.get("/get-user-interests",getUserPreferences);
module.exports = Router;
