const mongoose = require("mongoose");
const userSchema = mongoose.Schema({
    dp : {
        type : String,
        default : "https://i.pinimg.com/736x/b2/54/ea/b254ea1ec256b93c61aecb2aca62e277.jpg"
    },
    username : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true
    },
    education : {
        type : String,
        default : "Enthusiast at Nerd.net"
    },
    posts : {
        type : [mongoose.Schema.Types.ObjectId],
        ref : "posts",
    },
    followers : {
        type : [mongoose.Schema.Types.ObjectId],
        ref : "users",
        default : [],
    },
    following : {
        type : [mongoose.Schema.Types.ObjectId],
        ref : "users",
        default : [],
    }
});
const userModel = mongoose.model("users",userSchema);
module.exports = userModel;