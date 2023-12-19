const mongoose = require("mongoose");
const uniqueValidator = require('mongoose-unique-validator');

const postSchema = new mongoose.Schema({
    isMultimedia: {
        type: Boolean,
        required: true
    },
    userPosted: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    postData: {
        type: String,
        required: true,
    },
    likes: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            unique: true
        }],
        default: []
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
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            unique: true
        }],
        default: [],
    }
});

// Apply the unique validator plugin to the likes field
postSchema.plugin(uniqueValidator);

const postModel = mongoose.model("posts", postSchema);

module.exports = postModel;
