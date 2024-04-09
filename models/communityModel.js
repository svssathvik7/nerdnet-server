const mongoose = require("mongoose");

const communitySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique : true
    },
    dp: {
        type: String,
        required: true
    },
    coverPic: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users' // Assuming you have a User model
    }],
    createdBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "users",
        required : true
    },
    dateCreated : {
        type : Date,
        default : Date.now
    },
    posts : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "posts"
    }],
    admins : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users' // Assuming you have a User model
    }],
    assessments : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "assignments"
        }
    ]
});
const communityModel = mongoose.model("communities", communitySchema);
module.exports = { communityModel };
