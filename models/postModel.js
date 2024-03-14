const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    isMultimedia: {
        type: Boolean,
        required: true
    },
    userPosted: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
    },
    postData: {
        type: String,
        required: true,
    },
    likes : {
        type: [{
            type : mongoose.Schema.Types.ObjectId,
            ref : 'users',
        }],
        default: [],
    },
    comments: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "comments"
    },
    caption: {
        type: String,
        default: ""
    },
    time: {
        type: Date,
        default: Date.now()
    },
    tags: {
        type: [String],
        required: true
    },
    dislikes : {
        type: [{
            type : mongoose.Schema.Types.ObjectId,
            ref : 'users',
        }],
        default: [],
    }
});

function noDuplicateUsers(value) {
    return Array.isArray(value) && new Set(value).size === value.length;
}
postSchema.path("likes").validate({
    validator: noDuplicateUsers,
    message: 'Duplicate likes are not allowed'
});
postSchema.path("dislikes").validate({
    validator: noDuplicateUsers,
    message: 'Duplicate dislikes are not allowed'
});
const postModel = mongoose.model("posts", postSchema);

module.exports = postModel;
