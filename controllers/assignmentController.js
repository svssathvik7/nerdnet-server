const assignmentModel = require("../models/assignmentModel");
const commentModel = require("../models/commentModel");
const { communityModel } = require("../models/communityModel");
const createAssignment = async(req,res)=>{
    const data = req.body;
    console.log(data)
    try {
        const newAssessment = await new assignmentModel(data);
        await newAssessment.save();
        const communityMatch = await communityModel.findOne({_id:data.community});
        communityMatch.assessments.push(newAssessment._id);
        communityMatch.save();
        res.status(200).json({message:"Added test!",status:true});
    } catch (error) {
        res.status(500).json({message:"Something went wrong!",status:false});
        console.log(error);
    }
}
module.exports = {createAssignment}