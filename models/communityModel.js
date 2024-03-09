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
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users' // Assuming you have a User model
        },
        isAdmin: {
            type: Boolean,
            default: false // Default value for isAdmin
        }
    }],
    createdBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "users",
        required : true
    },
    dateCreated : {
        type : Date,
        default : Date.now
    }
});

const communityModel = mongoose.model("communities", communitySchema);
module.exports = { communityModel };
