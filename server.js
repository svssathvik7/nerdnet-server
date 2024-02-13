const dotenv = require("dotenv");
dotenv.config();
const {db} = require("./db/dataBase.js");
const authRoute = require("./routes/authentication.js");
const postRoute = require("./routes/postRouting.js");
const statRoute = require("./routes/stats.js");
const chatRoute = require("./routes/chatRouting.js");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const {Server} = require("socket.io");
const {getChat,addMessage} = require("./controllers/chatController.js");
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

const expressServer = app.listen(3500, () => {
    debugLog("Server running!");
});

const io = new Server(expressServer,
{
    cors : "http:localhost:3000",
    methods : ["Get","Post","Delete"]
});

io.on("connection",(socket)=>{
    socket.on("fetch-chat",(data)=>{
        getChat({socket,data});
    });
    socket.on("add-message",(data)=>{
        addMessage({socket,data});
    });
});

module.exports = {io};