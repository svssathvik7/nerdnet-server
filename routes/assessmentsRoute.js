const express = require("express");
const {createAssignment,getAssessment,writeScore} = require("../controllers/assignmentController");
const Router = express.Router();

Router.post("/create-assessment",createAssignment);
Router.post("/get-assessment",getAssessment);
Router.post("/write-score",writeScore);
module.exports = Router;