const mongoose = require("mongoose");
const commentSchema = new mongoose.Schema({
    post : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "posts",
        required : true
    },
    commentedUser : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "users",
        required : true
    },
    likes : {
        type : Number,
        default : 0
    },
    dislikes : {
        type : Number,
        default : 0
    },
    data : {
        type : String,
        required : true
    },
    date : {
        type : Date,
        default : Date.now()
    },
    replies : {
        type : [mongoose.Schema.Types.ObjectId],
        ref : "comments",
        default : []
    }
});
const commentModel = new mongoose.model("comments",commentSchema);
module.exports = commentModel;