const express = require("express");
const {createAssignment} = require("../controllers/assignmentController");
const Router = express.Router();

Router.post("/create-assessment",createAssignment);
module.exports = Router;