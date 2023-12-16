const mongoose = require("mongoose");
const commentSchema = new mongoose.Schema({
    postedBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "users"
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
    }
});
const commentModel = new mongoose.model("comments",commentSchema);
module.exports = commentModel;