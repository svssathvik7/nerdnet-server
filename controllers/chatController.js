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
    if(chatId === null){
        socket.emit("fetched-data/"+chatId,{message:"Something went wrong!",status:false});
        return;
    }
    try{
        const chats = await chatDb.findOne({id:chatId}).populate("chats chats.user");
        if(chats){
            socket.emit("fetched-data/"+chatId,{message:"Success",status:true,data:chats});
        }
        else{
            const chatSession = await new chatDb({
                id : chatId
            });
            await chatSession.save();
            socket.emit("fetched-data/"+chatId,{message:"Success",status:true,data:chatSession});
        }
    }
    catch(error){
        console.log(error);
        socket.emit("fetched-data/"+chatId,{message:"Something went wrong!",status:false});
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
                    socket.emit("fetched-data/"+chatId,{message:"Success",status:true,data:chatSessionMatch});
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


const addRecentChats = async (req, res) => {
    const {userId,friendId} = req.body;
    try {
        const userMatch = await userDb.findById(userId);
        const frndMatch = await userDb.findById(friendId);
        if (userMatch && frndMatch) {
            // Assuming recentChats is an array field in your schema
            var chatList = [...userMatch.recentChats, friendId];
            chatList = [...new Set(chatList)];
            await userDb.findOneAndUpdate({_id:userId},{
                $set : {
                    recentChats : chatList
                }
            });
            res.status(200).json({ message: "Successfully added friend to recent chats!", status: true });
        } else {
            res.status(401).json({ message: "Unauthorized access or user not found!", status: false });
        }
    } catch (error) {
        console.error("Error in adding recent chat:", error); // Improved error logging
        res.status(500).json({ message: "Something went wrong!", status: false });
    }
}

module.exports = {getChat,addMessage,addRecentChats};