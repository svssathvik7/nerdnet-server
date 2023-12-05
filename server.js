const dotenv = require("dotenv");
dotenv.config();
const db = require("./db/dataBase.js");
const auth = require("./routes/authentication.js");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const session = require("express-session");

const app = express();
const MongoDBStore = require('connect-mongodb-session')(session);

app.use(cors());
app.use(bodyParser.json());

const store = new MongoDBStore({
    uri: process.env.DB_CONNECTION_STRING,
    collection: "nerd-net-sessions"
});
app.use(session({
    secret: process.env.SESSION_SECRET || "MyBadProcessFileNotAdded",
    resave: false,
    saveUninitialized: false,
    store: store
}));

app.use("/api/auth/", auth);

app.listen(3500, () => {
    console.log("Server running!");
});
