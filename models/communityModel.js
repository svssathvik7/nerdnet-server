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
    }]
});
function noDuplicateUsers(value) {
    return Array.isArray(value) && new Set(value).size === value.length;
}
communitySchema.path("followers").validate({
    validator: noDuplicateUsers,
    message: 'Duplicate users are not allowed'
});
communitySchema.path("admins").validate({
    validator: noDuplicateUsers,
    message: 'Duplicate users are not allowed'
});
const communityModel = mongoose.model("communities", communitySchema);
module.exports = { communityModel };
