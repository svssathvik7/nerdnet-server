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
const getUrlWithouHost = async(url)=>{
    var count=0;
    for(var i=0;i<url.length;i++){
        if(url[i] == '/'){
            count += 1;
        }
        if(count==3){
            return url.substring(i+1);
        }
    }
    return url;
}
const addMessage = async ({socket,data})=>{
    const {chatId,userId,message} = data;
    const session = await getSession();
    try{
        const chatSessionMatch = await chatDb.findOne({id:chatId});
        const userMatch = await userDb.findOne({_id:userId});
        if(userMatch){
            if(chatSessionMatch){
                const encodedMessage = await getUrlWithouHost(message);
                await session.withTransaction(async ()=>{
                    const newMessage = await new messageDb({
                        user : userMatch._id,
                        message : isUrl(message) ? encodedMessage : message,
                        isUrl : isUrl(message)
                    });
                    await newMessage.save();
                    await chatSessionMatch.chats.push(newMessage);
                    await chatSessionMatch.save();
                    socket.emit("added-message",{message:"Success",status:true});
                    const newChatSessionMatch = await chatDb.findOne({id:chatId});
                    const populateMessages = await newChatSessionMatch.populate("chats chats.user");
                    const resss = socket.broadcast.emit("fetched-data/"+chatId,{message: "New message received",
                    status: true,
                    data: { chats: populateMessages.chats }});  
                })
            }
            else{
                socket.emit("added-message",{message:"No chat room found!",status:false});
                return ({message:"No chat room found!",status:false})
            }
            // session.commitTransaction();
        }
        else{
            socket.emit("added-message",{message:"Critical Security threat!",status:false});
            return {message:"Security alert!",status:false}
        }
    }
    catch(error){
        console.log(error);
        // session.abortTransaction();
        return {message:"Something went wrong!",status:false};
    }
}


const addRecentChats = async (req, res) => {
    const {userId,friendId} = req.body;
    console.log(req.body)
    try {
        const userMatch = await userDb.findById(userId);
        const frndMatch = await userDb.findById(friendId);
        if (userMatch && frndMatch) {
            // Assuming recentChats is an array field in your schema

            await userDb.findOneAndUpdate({_id:userId},{
                $addToSet : {
                    recentChats : friendId
                }
            });
            const chatList = await userDb.findById(userId).populate("recentChats");
            res.status(200).json({ message: "Successfully added friend to recent chats!", status: true,chatList:chatList });
        } else {
            res.status(401).json({ message: "Unauthorized access or user not found!", status: false });
        }
    } catch (error) {
        console.error("Error in adding recent chat:", error); // Improved error logging
        res.status(500).json({ message: "Something went wrong!", status: false });
    }
}

module.exports = {getChat,addMessage,addRecentChats};