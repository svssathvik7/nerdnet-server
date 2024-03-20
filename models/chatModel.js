const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'users',
        required : true
    },
    timestamp : {
        type : Date,
        default : Date.now
    },
    message : {
        type : String,
        required : true
    },
    isUrl : {
        type : Boolean,
        default : false
    }
})

const messageDb = new mongoose.model("messages",messageSchema);

const chatSchema = new mongoose.Schema({
    id : {
        type : String,
        required : true
    },
    chats : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'messages'
    }]
})

const chatDb = new mongoose.model("chats",chatSchema);

module.exports = {messageDb,chatDb};