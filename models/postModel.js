const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    isMultimedia : {
        type : Boolean,
        required : true
    },
    userPosted : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "users"
    },
    postData : {
        type : String,
        required : true,
    },
    likes : {
        type : Number,
        default : 0
    },
    comments : {
        type : [mongoose.Schema.Types.ObjectId],
        ref : "comments"
    },
    caption : {
        type : String,
        default : ""
    },
    time : {
        type : Date,
        default : Date.now()
    },
    tags : {
        type : [String],
        required : true
    }
});

const postModel = new mongoose.model("posts",postSchema);

module.exports = postModel;