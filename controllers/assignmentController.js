const assignmentModel = require("../models/assignmentModel");
const commentModel = require("../models/commentModel");
const { communityModel } = require("../models/communityModel");
const createAssignment = async(req,res)=>{
    const data = req.body;
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
const getAssessment = async(req,res)=>{
    try {
        const {assessment_id} = req.body;
        const testMatch = await assignmentModel.findOne({_id:assessment_id});
        res.status(200).json({message:"Success!",status:true,assessment:testMatch});
    } catch (error) {
        res.status(500).json({message:"Something went wrong!",status:false});
        console.log(error);
    }
}
const writeScore = async(req,res)=>{
    try {
        const {user,assessment_id,score,outOf} = req.body;
        const assessment_match = await assignmentModel.findOne({_id:assessment_id});
        var leaderBoard = assessment_match?.leaderboard??[];
        leaderBoard.push({user:user,score:score});
        leaderBoard.sort();
        const test_update = await assignmentModel.findOneAndUpdate({_id:assessment_id},{
            $set : {
                outOf : outOf
            },
            $set : {
                leaderboard : leaderBoard
            }
        });
        res.status(200).json({message:"Success",status:true});
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Something went wrong!",status:false});
    }
}
module.exports = {createAssignment,getAssessment,writeScore}