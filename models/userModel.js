const mongoose = require("mongoose");
const userSchema = mongoose.Schema({
    dp : {
        type : String,
        required : false,
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
    dob : {
        type : String,
        required : true
    },
    posts : {
        type : [mongoose.Schema.Types.ObjectId],
        ref : "posts",
    }
});
const userModel = mongoose.model("users",userSchema);
module.exports = userModel;