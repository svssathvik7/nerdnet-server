const {chatDb} = require("../models/chatModel");
const {messageDb} = require("../models/chatModel");
const {getSession} = require("../db/dataBase");
const userDb = require("../models/userModel");
const urlRegex = /(https?:\/\/[^\s]+)$/;
const isUrl = (text)=>{
    return urlRegex.test(text);
}
const getChat = async ({socket,data})=>{
    const chatId = data.chatId;
    try{
        const chats = await chatDb.findOne({id:chatId}).populate("chats chats.user chats.reaction.userReacted");
        if(chats){
            socket.emit("fetched-data",{message:"Success",status:true,data:chats});
        }
        else{
            const chatSession = await new chatDb({
                id : chatId
            });
            await chatSession.save();
            socket.emit("fetched-data",{message:"Success",status:true,data:chatSession});
        }
    }
    catch(error){
        console.log(error);
        socket.emit("fetched-data",{message:"Something went wrong!",status:false});
    }
}

const addMessage = async ({socket,data})=>{
    const {chatId,userId,message} = data;
    const session = await getSession();
    try{
        const chatSessionMatch = await chatDb.findOne({id:chatId});
        const userMatch = await userDb.findOne({_id:userId});
        if(userMatch){
            if(chatSessionMatch){
                await session.withTransaction(async ()=>{
                    const newMessage = await new messageDb({
                        user : userMatch._id,
                        message : message,
                        isUrl : isUrl(message)
                    });
                    await newMessage.save();
                    await chatSessionMatch.chats.push(newMessage);
                    await chatSessionMatch.save();
                    socket.emit("added-message",{message:"Success",status:true});
                })
            }
            else{
                socket.emit("added-message",{message:"No chat room found!",status:false});
            }
            // session.commitTransaction();
        }
        else{
            socket.emit("added-message",{message:"Critical Security threat!",status:false});
        }
    }
    catch(error){
        console.log(error);
        // session.abortTransaction();
        socket.emit("fetched-data",{message:"Something went wrong!",status:false});
    }
}
const addChatReaction = async (req,res)=>{
    const {messageId,reaction,userId} = req.body;
    try{
        const messageMatch = await messageDb.findById(messageId);
        const userMatch = await userDb.findById(userId);
        if(messageMatch && userMatch){
            await messageMatch.reactions.push({userReacted:userId,reaction:reaction});
            console.log(messageMatch);
            await messageMatch.save();
            res.status(200).json({message:"Success",status:true});
        }
        else{
            res.status(401).json({message:"Critical Security threat!",status:false});
        }
    }
    catch(error){
        console.log(error);
        res.status(500).json({message:"Something went wrong!",status:false});
    }
}
module.exports = {getChat,addMessage,addChatReaction};