const dotenv = require("dotenv");
dotenv.config();
const {db} = require("./db/dataBase.js");
const authRoute = require("./routes/authentication.js");
const postRoute = require("./routes/postRouting.js");
const statRoute = require("./routes/stats.js");
const chatRoute = require("./routes/chatRouting.js");
const communityRoute = require("./routes/community.js");
const {createCommunity,getCommunityInfo, checkUserSubscription} = require("./controllers/communityController");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const {Server} = require("socket.io");
const {getChat,addMessage} = require("./controllers/chatController.js");
const { getUserInformation, sendTrendingNerds, sendTrendingTopics, sendTrendingPosts, getMySpaces } = require("./controllers/statistics.js");
const getUserProfile = require("./controllers/getUserProfile.js");
const { getAllUsers } = require("./controllers/adminStats.js");
// const morgan = require("morgan");
const debugLog = require("debug")("app:debugLog");
const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
// if(app.get('env') === 'development')
// {
//     app.use(morgan('tiny'));
//     console.log("Morgan enabled...")
// }

app.use("/api/auth/", authRoute);
app.use("/api/posts/",postRoute);
app.use("/api/stats/",statRoute);
app.use("/api/chat/",chatRoute);
app.use("/api/community/",communityRoute);
const expressServer = app.listen(3500, () => {
    debugLog("Server running!");
});

const io = new Server(expressServer,
{
    cors : "0.0.0.0",
    methods : ["Get","Post","Delete"]
});

io.on("connection",(socket)=>{
    socket.on("fetch-chat",(data)=>{
        getChat({socket,data});
    });
    socket.on("add-message",(data)=>{
        addMessage({socket,data});
    });
    socket.on("get-community-details",async(data,callback)=>{
        const response = await getCommunityInfo({socket,data});
        callback(response);
    });
    socket.on("get-community-founder",async(data,callback)=>{
        const response = await getUserInformation({socket,data});
        callback(response);
    });
    socket.on("get-profile-details",async(data,callback)=>{
        const response = await getUserProfile({socket,data});
        callback(response);
    });
    socket.on("get-trending-nerds",async(callback)=>{
        const response = await sendTrendingNerds();
        callback(response);
    });
    socket.on("get-trending-topics",async(callback)=>{
        const response = await sendTrendingTopics();
        callback(response);
    });
    socket.on("get-trending-posts",async(callback)=>{
        const response = await sendTrendingPosts();
        callback(response);
    });
    socket.on("get-user-spaces",async(data,callback)=>{
        const response = await getMySpaces({socket,data});
        callback(response);
    });
    socket.on("check-community-subscription",async(data,callback)=>{
        const response = await checkUserSubscription({socket,data});
        callback(response);
    });
    socket.on("admin-get-all-users",async(data,callback)=>{
        const response = await getAllUsers({socket,data});
        callback(response);
    })
});

module.exports = {io};